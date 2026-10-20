import type { RedisClient } from './types.js';

export type RedisXScriptOptions<I = string[], O = unknown> = {
	code: string;
	keys?: string[];
	inputValidator?: (value: I) => (string | number)[];
	outputValidator?: (value: unknown) => O;
};

export class RedisXScript<
	// oxlint-disable-next-line typescript/no-explicit-any
	I extends any[] = string[],
	O = unknown,
> {
	#redisClient: RedisClient;
	#options: RedisXScriptOptions<I, O>;
	#sha: string | null = null;

	constructor(redisClient: RedisClient, options: RedisXScriptOptions<I, O>) {
		this.#redisClient = redisClient;
		this.#options = options;
	}

	private async load() {
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
		this.#sha ??= await this.load();

		try {
			const result = await this.#redisClient.sendCommand([
				'EVALSHA',
				this.#sha,
				String(keys.length),
				...keys,
				...(this.#options.inputValidator
					? this.#options.inputValidator(args).map(String)
					: args),
			]);

			return this.#options.outputValidator
				? this.#options.outputValidator(result)
				: (result as O);
		} catch (error) {
			if (error instanceof Error && error.message.startsWith('NOSCRIPT')) {
				this.#sha = null;
				return this.executeWithKeys(keys, ...args);
			}

			throw error;
		}
	}
}
