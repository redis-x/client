import type { Command } from '../../types.js';

/**
 * Returns the length of the string value stored at key.
 * An error is returned when key holds a non-string value.
 *
 * - Available since: 2.2.0.
 * - Time complexity: O(1).
 * @param key Key to get length of.
 * @returns The length of the string stored at key, or 0 when the key does not exist.
 * @see {@link https://redis.io/commands/strlen}
 */
export function input(key: string): Command<number> {
	return {
		kind: '#schema',
		args: [
			'STRLEN',
			key,
		],
	};
}
