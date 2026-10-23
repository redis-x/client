import type { Command } from '../../types.js';

/**
 * Returns the absolute Unix timestamp (since January 1, 1970) in seconds at which the given key will expire.
 * - Available since: 7.0.0.
 * - Time complexity: O(1).
 * @param key Key to get expiration time for.
 * @returns One of the following:
 * - A number representing the expiration Unix timestamp in seconds.
 * - `-1` if the key exists but has no associated expiration time.
 * - `-2` if the key does not exist.
 * @see {@link https://redis.io/commands/expiretime}
 */
export function input(key: string): Command<number> {
	return {
		kind: '#schema',
		args: ['EXPIRETIME', key],
	};
}
