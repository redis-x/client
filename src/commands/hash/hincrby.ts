import type { Command } from '../../types.js';

/**
 * Increments the number stored at field in the hash stored at key by increment.
 * If key does not exist, a new key holding a hash is created. If field does not
 * exist the value is set to 0 before the operation is performed.
 *
 * The range of values supported by HINCRBY is limited to 64 bit signed integers.
 *
 * - Available since: 2.0.0.
 * - Time complexity: O(1).
 * @param key Key of the hash.
 * @param field Field in the hash to increment.
 * @param increment The increment value (can be negative for decrementing).
 * @returns The value of the field after the increment operation.
 * @see {@link https://redis.io/commands/hincrby}
 */
export function input(key: string, field: string | number, increment: number): Command<number> {
	return {
		kind: '#schema',
		args: [
			'HINCRBY',
			key,
			String(field),
			String(increment),
		],
	};
}
