import type { StandardSchemaV1 } from '@standard-schema/spec';
import type { RedisClient } from './types.js';

type RedisXScriptInputOptions<I> =
	| {
			/** Converts `execute()` arguments to script arguments. */
			inputValidator?: (value: I) => (string | number)[];
			inputSchema?: never;
	  }
	| {
			/**
			 * Standard Schema that validates `execute()` arguments and converts them to script arguments.
			 * Its input must be an array or a tuple.
			 */
			inputSchema: StandardSchemaV1<I, readonly (string | number)[]>;
			inputValidator?: never;
	  };

type RedisXScriptOutputOptions<O> =
	| {
			/** Converts the script result. */
			outputValidator?: (value: unknown) => O;
			outputSchema?: never;
	  }
	| {
			/** Standard Schema that validates and converts the script result. */
			outputSchema: StandardSchemaV1<unknown, O>;
			outputValidator?: never;
	  };

export type RedisXScriptOptions<I = string[], O = unknown> = {
	code: string;
	keys?: string[];
} & RedisXScriptInputOptions<I> &
	RedisXScriptOutputOptions<O>;

export class RedisXScriptValidationError extends Error {
	override readonly name = 'RedisXScriptValidationError';
	/** Whether the `execute()` arguments or the script result failed validation. */
	readonly target: 'input' | 'output';
	/** Issues reported by the schema. */
	readonly issues: readonly StandardSchemaV1.Issue[];

	/**
	 * @param target Whether the `execute()` arguments or the script result failed validation.
	 * @param issues Issues reported by the schema.
	 */
	constructor(
		target: 'input' | 'output',
		issues: readonly StandardSchemaV1.Issue[],
	) {
		super(
			`Script ${target} failed schema validation: ${issues.map((issue) => issue.message).join('; ')}`,
		);
		this.target = target;
		this.issues = issues;
	}
}

/**
 * Validates a value with a Standard Schema.
 * @param schema Schema to validate with.
 * @param value Value to validate.
 * @param target Which value is validated, used in the error.
 * @returns The schema output.
 * @throws {RedisXScriptValidationError} If the schema reports issues.
 */
async function validate<O>(
	schema: StandardSchemaV1<unknown, O>,
	value: unknown,
	target: 'input' | 'output',
): Promise<O> {
	const result = await schema['~standard'].validate(value);
	if (result.issues) {
		throw new RedisXScriptValidationError(target, result.issues);
	}

	return result.value;
}

export class RedisXScript<
	I extends readonly unknown[] = string[],
	O = unknown,
> {
	#redisClient: RedisClient;
	#options: RedisXScriptOptions<I, O>;
	#sha: string | null = null;

	constructor(redisClient: RedisClient, options: RedisXScriptOptions<I, O>) {
		if (options.inputValidator && options.inputSchema) {
			throw new TypeError(
				'Pass either inputValidator or inputSchema, not both.',
			);
		}

		if (options.outputValidator && options.outputSchema) {
			throw new TypeError(
				'Pass either outputValidator or outputSchema, not both.',
			);
		}

		this.#redisClient = redisClient;
		this.#options = options;
	}

	async #load() {
		const result = await this.#redisClient.sendCommand([
			'SCRIPT',
			'LOAD',
			this.#options.code,
		]);
		if (typeof result !== 'string') {
			throw new TypeError('Invalid response from SCRIPT LOAD');
		}

		this.#sha = result;
		return result;
	}

	execute(...args: I): Promise<O> {
		return this.executeWithKeys(this.#options.keys ?? [], ...args);
	}

	async executeWithKeys(keys: string[], ...args: I): Promise<O> {
		const script_args = await this.#convertInput(args);
		const result = await this.#evalsha(keys, script_args);

		return await this.#convertOutput(result);
	}

	async #convertInput(args: I): Promise<string[]> {
		if (this.#options.inputSchema) {
			const script_args = await validate(
				this.#options.inputSchema,
				args,
				'input',
			);
			return script_args.map(String);
		}

		if (this.#options.inputValidator) {
			return this.#options.inputValidator(args).map(String);
		}

		return args as unknown as string[];
	}

	async #convertOutput(result: unknown): Promise<O> {
		if (this.#options.outputSchema) {
			return await validate(this.#options.outputSchema, result, 'output');
		}

		if (this.#options.outputValidator) {
			return this.#options.outputValidator(result);
		}

		return result as O;
	}

	async #evalsha(keys: string[], args: string[]): Promise<unknown> {
		this.#sha ??= await this.#load();

		try {
			return await this.#redisClient.sendCommand([
				'EVALSHA',
				this.#sha,
				String(keys.length),
				...keys,
				...args,
			]);
		} catch (error) {
			if (error instanceof Error && error.message.startsWith('NOSCRIPT')) {
				this.#sha = null;
				return this.#evalsha(keys, args);
			}

			throw error;
		}
	}
}
