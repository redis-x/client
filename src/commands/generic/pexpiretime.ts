import type { Command } from '../../types.js';

/**
 * PEXPIRETIME has the same semantic as EXPIRETIME, but returns the absolute Unix expiration timestamp in milliseconds instead of seconds.
 * - Available since: 7.0.0.
 * - Time complexity: O(1).
 * @param key Key to get expiration time for.
 * @returns One of the following:
 * - A number representing the expiration Unix timestamp in milliseconds.
 * - `-1` if the key exists but has no associated expiration time.
 * - `-2` if the key does not exist.
 * @see {@link https://redis.io/commands/pexpiretime}
 * @see {@link https://redis.io/commands/expiretime}
 */
export function input(key: string): Command<number> {
	return {
		kind: '#schema',
		args: [
			'PEXPIRETIME',
			key,
		],
	};
}
