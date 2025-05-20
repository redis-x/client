import type { Command } from '../../types.js';

/**
 * Returns the string representation of the type of the value stored at `key`.
 * - Available since: 1.0.0.
 * - Time complexity: O(1).
 * @param key The key to check.
 * @returns "OK".
 * @see {@link https://redis.io/commands/rename}
 */
export function input(key: string): Command<'string' | 'list' | 'set' | 'zset' | 'hash' | 'stream' | 'vectorset'> {
	return {
		kind: '#schema',
		args: [
			'TYPE',
			key,
		],
	};
}
