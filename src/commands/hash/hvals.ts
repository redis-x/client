import type { Command } from '../../types.js';

/**
 * Returns all values in the hash stored at key.
 * - Available since: 2.0.0.
 * - Time complexity: O(N) where N is the size of the hash.
 * @param key The key of the hash.
 * @returns An array of values in the hash, preserving duplicates, or an empty array when the key does not exist.
 * @see {@link https://redis.io/commands/hvals}
 */
export function input(key: string): Command<string[]> {
	return {
		kind: '#schema',
		args: ['HVALS', key],
	};
}
