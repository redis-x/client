import type { Command } from '../../types.js';

/**
 * Increments the number stored at key by increment. If the key does not exist, it is set to 0 before performing the operation.
 * An error is returned if the key contains a value of the wrong type or contains a string that cannot be represented as integer.
 * This operation is limited to 64 bit signed integers.
 *
 * - Available since: 1.0.0.
 * - Time complexity: O(1).
 * @param key Key to increment.
 * @param increment Amount to increment by.
 * @returns The value of the key after the increment.
 * @see {@link https://redis.io/commands/incrby}
 */
export function input(key: string, increment: number): Command<number> {
	return {
		kind: '#schema',
		args: ['INCRBY', key, String(increment)],
	};
}
