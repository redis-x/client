import type { Command } from '../../types.js';

/**
 * Set key to hold the string value and set key to timeout after a given number of seconds.
 * This command is equivalent to SET key value EX seconds.
 *
 * - Available since: 2.0.0.
 * - Time complexity: O(1).
 * @deprecated As of Redis version 2.6.12, this command is regarded as deprecated. It can be replaced by SET with the EX argument when migrating or writing new code.
 * @param key Key to set.
 * @param seconds Timeout in seconds.
 * @param value Value to set.
 * @returns Simple string reply: OK.
 * @see {@link https://redis.io/commands/setex}
 */
export function input(key: string, seconds: number, value: string | number): Command<'OK'> {
	return {
		kind: '#schema',
		args: [
			'SETEX',
			key,
			String(seconds),
			String(value),
		],
	};
}
