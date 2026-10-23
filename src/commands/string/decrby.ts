import type { Command } from '../../types.js';

/**
 * Reduces the value stored at the specified key by the specified decrement.
 * If the key does not exist, it is initialized with a value of 0 before performing the operation.
 * If the key's value is not of the correct type or cannot be represented as an integer, an error is returned.
 * This operation is limited to 64-bit signed integers.
 *
 * - Available since: 1.0.0.
 * - Time complexity: O(1).
 * @param key Key to decrement.
 * @param decrement The value to decrement by.
 * @returns The value of the key after decrementing it.
 * @see {@link https://redis.io/commands/decrby}
 */
export function input(key: string, decrement: number): Command<number> {
	return {
		kind: '#schema',
		args: ['DECRBY', key, String(decrement)],
	};
}
