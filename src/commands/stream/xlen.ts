import type { Command } from '../../types.js';

/**
 * Returns the number of entries inside a stream. If the specified key does not exist
 * the command returns zero, as if the stream was empty. However note that unlike other
 * Redis types, zero-length streams are possible, so you should call TYPE or EXISTS in
 * order to check if a key exists or not.
 *
 * Streams are not auto-deleted once they have no entries inside (for instance after an
 * XDEL call), because the stream may have consumer groups associated with it.
 *
 * - Available since: 5.0.0.
 * - Time complexity: O(1).
 * @param key The key of the stream.
 * @returns The number of entries of the stream at key.
 * @see {@link https://redis.io/commands/xlen}
 */
export function input(key: string): Command<number> {
	return {
		kind: '#schema',
		args: ['XLEN', key],
	};
}
