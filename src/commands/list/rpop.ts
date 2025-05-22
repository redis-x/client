import type { Command } from '../../types.js';

/**
 * Removes and returns the last elements of the list stored at key.
 *
 * By default, the command pops a single element from the end of the list.
 * When provided with the optional count argument, the reply will consist
 * of up to count elements, depending on the list's length.
 *
 * - Available since: 1.0.0.
 * - Time complexity: O(N) where N is the number of elements returned.
 * @param key The key of the list.
 * @returns The value of the last element, or `null` when key does not exist.
 * @see {@link https://redis.io/commands/rpop}
 */
declare function _command(key: string): string | null;

/**
 * Removes and returns the last elements of the list stored at key.
 *
 * By default, the command pops a single element from the end of the list.
 * When provided with the optional count argument, the reply will consist
 * of up to count elements, depending on the list's length.
 *
 * - Available since: 6.2.0 (for the count argument).
 * - Time complexity: O(N) where N is the number of elements returned.
 * @param key The key of the list.
 * @param count The number of elements to pop.
 * @returns Array of popped elements, or `null` when key does not exist.
 * @see {@link https://redis.io/commands/rpop}
 */
declare function _command(key: string, count: number): string[] | null;

// eslint-disable-next-line jsdoc/require-jsdoc
export function input(key: string, count?: number): Command<string | string[] | null> {
	if (count !== undefined) {
		return {
			kind: '#schema',
			args: [
				'RPOP',
				key,
				String(count),
			],
		};
	}

	return {
		kind: '#schema',
		args: [
			'RPOP',
			key,
		],
	};
}
