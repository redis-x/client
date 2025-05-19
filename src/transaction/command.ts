import { isPlainObject } from '../utils.js';

export class RedisXTransactionCommand<T> {
	private _type!: T; // Dummy private property

	// eslint-disable-next-line no-useless-constructor, no-empty-function
	constructor(public index: number) {}
}

export type UnwrapRedisXTransactionCommand<T> =
	T extends RedisXTransactionCommand<infer A>
		? A
		: T extends (infer U)[]
			? UnwrapRedisXTransactionCommand<U>[]
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			: T extends Record<string, any>
				? { [K in keyof T]: UnwrapRedisXTransactionCommand<T[K]> }
				: T;

/**
 * Recursively walks through the object and unwraps all RedisTransactionCommand instances.
 * @param target Value to unwrap.
 * @param result Result of the transaction.
 * @returns The unwrapped value.
 */
export function unwrapRedisTransactionCommand<T>(target: T, result: unknown[]): UnwrapRedisXTransactionCommand<T> {
	if (target instanceof RedisXTransactionCommand) {
		return result[target.index] as UnwrapRedisXTransactionCommand<T>;
	}

	if (Array.isArray(target)) {
		for (const [ index, value ] of target.entries()) {
			target[index] = unwrapRedisTransactionCommand(value, result);
		}
	}
	else if (isPlainObject(target)) {
		for (const [ key, value ] of Object.entries(target)) {
			// @ts-expect-error Somehow TS does not allow to write into the object
			target[key] = unwrapRedisTransactionCommand(value, result);
		}
	}

	return target as UnwrapRedisXTransactionCommand<T>;
}
