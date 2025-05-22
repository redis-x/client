import type { Command } from '../../types.js';

/**
 * Returns the set cardinality (number of elements) of the set stored at key.
 *
 * - Available since: 1.0.0.
 * - Time complexity: O(1).
 * @param key The key of the set.
 * @returns The cardinality (number of elements) of the set, or `0` if the key does not exist.
 * @see {@link https://redis.io/commands/scard}
 */
export function input(key: string): Command<number> {
	return {
		kind: '#schema',
		args: [
			'SCARD',
			key,
		],
	};
}
