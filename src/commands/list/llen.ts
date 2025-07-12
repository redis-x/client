import type { Command } from '../../types.js';

/**
 * Returns the length of the list stored at key. If key does not exist, it is interpreted as an empty list and 0 is returned.
 * An error is returned when the value stored at key is not a list.
 *
 * - Available since: 1.0.0.
 * - Time complexity: O(1).
 * @param key Key to get the length of the list for.
 * @returns The length of the list at key.
 * @see {@link https://redis.io/commands/llen}
 */
export function input(key: string): Command<number> {
	return {
		kind: '#schema',
		args: ['LLEN', key],
	};
}
