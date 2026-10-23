import type { Command } from '../../types.js';

/**
 * Atomically sets key to value and returns the old value stored at key.
 * Returns an error when key exists but does not hold a string value.
 * Any previous time to live associated with the key is discarded on successful SET operation.
 *
 * - Available since: 1.0.0.
 * - Time complexity: O(1).
 * @deprecated As of Redis version 6.2.0, this command is regarded as deprecated. It can be replaced by SET with the GET argument when migrating or writing new code.
 * @param key Key to set.
 * @param value Value to set.
 * @returns The old value stored at key, or `null` if key did not exist.
 * @see {@link https://redis.io/commands/getset}
 */
export function input(
	key: string,
	value: string | number,
): Command<string | null> {
	return {
		kind: '#schema',
		args: ['GETSET', key, String(value)],
	};
}
