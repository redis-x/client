import type { RedisClient } from './types.js';

export type RedisXScriptOptions<I = string[], O = unknown> = {
	code: string;
	keys?: string[];
	inputValidator?: (value: I) => string[];
	outputValidator?: (value: unknown) => O;
};

export class RedisXScript<
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	I extends any[] = string[],
	O = unknown,
> {
	private code: string;
	private keys: string[] = [];
	private sha: string | null = null;
	private inputValidator?: (value: I) => string[];
	private outputValidator?: (value: unknown) => O;

	constructor(
		private client: RedisClient,
		options: RedisXScriptOptions<I, O>,
	) {
		this.code = options.code;

		if (options.keys) {
			this.keys = options.keys;
		}

		this.inputValidator = options.inputValidator;
		this.outputValidator = options.outputValidator;
	}

	private async load() {
		const result = await this.client.sendCommand(['SCRIPT', 'LOAD', this.code]);
		if (typeof result !== 'string') {
			throw new TypeError('Invalid response from SCRIPT LOAD');
		}

		this.sha = result;
		return result;
	}

	async execute(...args: I): Promise<O> {
		if (this.sha === null) {
			this.sha = await this.load();
		}

		try {
			const result = await this.client.sendCommand([
				'EVALSHA',
				this.sha,
				String(this.keys.length),
				...this.keys,
				...(this.inputValidator ? this.inputValidator(args) : args),
			]);

			return this.outputValidator
				? this.outputValidator(result)
				: (result as O);
		} catch (error) {
			if (error instanceof Error && error.message.startsWith('NOSCRIPT')) {
				this.sha = null;
				return this.execute(...args);
			}

			throw error;
		}
	}
}
