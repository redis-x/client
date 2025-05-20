import type { Command } from '../../types.js';

/**
 * Get the value of key and delete the key. This command is similar to GET, except for the fact
 * that it also deletes the key on success (if and only if the key's value type is a string).
 *
 * - Available since: 6.2.0.
 * - Time complexity: O(1).
 * @param key Key to get and delete.
 * @returns The value of key, or `null` when key does not exist or its value is not a string.
 * @see {@link https://redis.io/commands/getdel}
 */
export function input(key: string): Command<string | null> {
	return {
		kind: '#schema',
		args: [
			'GETDEL',
			key,
		],
	};
}
