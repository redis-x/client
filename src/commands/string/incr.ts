import type { Command } from '../../types.js';

/**
 * Increments the number stored at key by one. If the key does not exist,
 * it is set to 0 before performing the operation. An error is returned if the
 * key contains a value of the wrong type or contains a string that can not
 * be represented as integer. This operation is limited to 64 bit signed integers.
 * - Available since: 1.0.0.
 * - Time complexity: O(1).
 * @param key Key to increment.
 * @returns The value of the key after incrementing it.
 * @see {@link https://redis.io/commands/incr}
 */
export function input(key: string): Command<number> {
	return {
		kind: '#schema',
		args: ['INCR', key],
	};
}
