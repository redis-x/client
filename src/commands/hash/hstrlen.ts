import type { Command } from '../../types.js';

/**
 * Returns the string length of the value associated with field in the hash stored at key.
 * If the key or the field do not exist, 0 is returned.
 *
 * - Available since: 3.2.0.
 * - Time complexity: O(1).
 * @param key The key of the hash.
 * @param field The field in the hash.
 * @returns The string length of the value associated with the field, or zero when the field isn't present in the hash or the key doesn't exist at all.
 * @see {@link https://redis.io/commands/hstrlen}
 */
export function input(key: string, field: string): Command<number> {
	return {
		kind: '#schema',
		args: [
			'HSTRLEN',
			key,
			field,
		],
	};
}
