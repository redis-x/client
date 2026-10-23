import type { Command } from '../../types.js';

/**
 * Returns the remaining time to live of a key that has a timeout, in milliseconds.
 *
 * Like TTL this command returns the remaining time to live of a key that has an
 * expire set, with the sole difference that TTL returns the amount of remaining
 * time in seconds while PTTL returns it in milliseconds.
 *
 * - Available since: 2.6.0.
 * - Time complexity: O(1).
 * @param key The key to check.
 * @returns One of the following:
 * - A positive integer: TTL in milliseconds.
 * - `-1`: if the key exists but has no associated expiration.
 * - `-2`: if the key does not exist.
 * @see {@link https://redis.io/commands/pttl}
 * @see {@link https://redis.io/commands/ttl}
 */
export function input(key: string): Command<number> {
	return {
		kind: '#schema',
		args: ['PTTL', key],
	};
}
