import type { Command } from '../../types.js';

/**
 * Returns the string representation of the type of the value stored at `key`.
 * - Available since: 1.0.0.
 * - Time complexity: O(1).
 * @param key The key to check.
 * @returns The type of the value stored at the key, or `"none"` if the key does not exist.
 * @see {@link https://redis.io/commands/type}
 */
export function input(
	key: string,
): Command<
	'none' | 'string' | 'list' | 'set' | 'zset' | 'hash' | 'stream' | 'vectorset'
> {
	return {
		kind: '#schema',
		args: ['TYPE', key],
	};
}
