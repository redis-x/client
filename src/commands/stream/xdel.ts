import type { Command } from '../../types.js';

/**
 * Removes the specified entries from a stream, and returns the number of entries deleted.
 * This number may be less than the number of IDs passed to the command in the case where
 * some of the specified IDs do not exist in the stream.
 *
 * - Available since: 5.0.0.
 * - Time complexity: O(1) for each single item to delete in the stream, regardless of the stream size.
 * @param key The key of the stream.
 * @param ids The IDs of the entries to remove.
 * @returns The number of entries actually deleted.
 * @see {@link https://redis.io/commands/xdel}
 */
declare function _command(key: string, ids: string[]): number;

/**
 * Removes the specified entries from a stream, and returns the number of entries deleted.
 * This number may be less than the number of IDs passed to the command in the case where
 * some of the specified IDs do not exist in the stream.
 *
 * - Available since: 5.0.0.
 * - Time complexity: O(1) for each single item to delete in the stream, regardless of the stream size.
 * @param key The key of the stream.
 * @param ids The IDs of the entries to remove.
 * @returns The number of entries actually deleted.
 * @see {@link https://redis.io/commands/xdel}
 */
declare function _command(key: string, ...ids: string[]): number;

// eslint-disable-next-line jsdoc/require-jsdoc
export function input(
	key: string,
	...ids: (string | string[])[]
): Command<number> {
	return {
		kind: '#schema',
		args: ['XDEL', key, ...ids.flat()],
	};
}
