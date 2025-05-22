import type { Command } from '../../types.js';

/**
 * Returns the number of fields contained in the hash stored at key.
 *
 * - Available since: 2.0.0.
 * - Time complexity: O(1).
 * @param key Key to get hash length.
 * @returns The number of fields in the hash, or 0 when the key does not exist.
 * @see {@link https://redis.io/commands/hlen}
 */
export function input(key: string): Command<number> {
	return {
		kind: '#schema',
		args: [
			'HLEN',
			key,
		],
	};
}
