import type { Command } from '../../types.js';

/**
 * Set key to hold the string value and set key to timeout after a given number of milliseconds.
 * This command is similar to SETEX, except that the expiration time is specified in milliseconds instead of seconds.
 *
 * - Available since: 2.6.0.
 * - Time complexity: O(1).
 * @deprecated As of Redis version 2.6.12, this command is regarded as deprecated. It can be replaced by SET with the PX argument when migrating or writing new code.
 * @param key Key to set.
 * @param milliseconds Expiration time in milliseconds.
 * @param value Value to set.
 * @returns "OK" if the command was executed successfully.
 * @see {@link https://redis.io/commands/psetex}
 */
export function input(key: string, milliseconds: number, value: string | number): Command<'OK'> {
	return {
		kind: '#schema',
		args: [
			'PSETEX',
			key,
			String(milliseconds),
			String(value),
		],
	};
}
