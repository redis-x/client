import type { Command } from '../../types.js';

/**
 * Renames `key` to `newkey`. It returns an error when `key` does not exist. If `newkey` already exists it is overwritten.
 *
 * - Available since: 1.0.0.
 * - Time complexity: O(1).
 * @param key The key to rename.
 * @param newkey The new key name.
 * @returns "OK".
 * @see {@link https://redis.io/commands/rename}
 */
export function input(key: string, newkey: string): Command<'OK'> {
	return {
		kind: '#schema',
		args: [
			'RENAME',
			key,
			newkey,
		],
	};
}
