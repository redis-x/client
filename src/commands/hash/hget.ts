import type { Command } from '../../types.js';

/**
 * Returns the value associated with field in the hash stored at key.
 * - Available since: 2.0.0.
 * - Time complexity: O(1)
 * @param key -
 * @param field -
 * @returns The value associated with field in the hash stored at key or null.
 * @see {@link https://redis.io/commands/hget}
 */
export function input(key: string, field: string): Command<string | null> {
	return {
		kind: '#schema',
		args: ['HGET', key, field],
	};
}
