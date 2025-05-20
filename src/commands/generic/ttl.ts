import type { Command } from '../../types.js';

/**
 * Returns the remaining time to live of a key that has a timeout.
 *
 * This introspection capability allows a Redis client to check how many seconds
 * a given key will continue to be part of the dataset.
 *
 * - Available since: 1.0.0.
 * - Time complexity: O(1).
 * @param key The key to check.
 * @returns One of the following:
 * - A positive integer: TTL in seconds.
 * - `-1`: if the key exists but has no associated expiration.
 * - `-2`: if the key does not exist.
 * @see {@link https://redis.io/commands/ttl}
 */
export function input(key: string): Command<number> {
	return {
		kind: '#schema',
		args: [
			'TTL',
			key,
		],
	};
}
