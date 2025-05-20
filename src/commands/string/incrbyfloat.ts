import type { Command } from '../../types.js';

/**
 * Increment the string representing a floating point number stored at key by the specified increment.
 * By using a negative increment value, the result is that the value stored at the key is decremented.
 * If the key does not exist, it is set to 0 before performing the operation.
 *
 * - Available since: 2.6.0.
 * - Time complexity: O(1).
 * @param key Key to increment.
 * @param increment Value to increment by.
 * @returns The value of key after the increment.
 * @see {@link https://redis.io/commands/incrbyfloat}
 */
export function input(key: string, increment: number): Command<string> {
	return {
		kind: '#schema',
		args: [
			'INCRBYFLOAT',
			key,
			String(increment),
		],
	};
}
