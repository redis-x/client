import type { Command } from '../../types.js';

/**
 * Returns the sorted set cardinality (number of elements) of the sorted set stored at key.
 * - Available since: 1.2.0.
 * - Time complexity: O(1).
 * @param key Key holds a sorted set.
 * @returns The cardinality (number of members) of the sorted set, or 0 if the key doesn't exist.
 * @see {@link https://redis.io/commands/zcard}
 */
export function input(key: string): Command<number> {
	return {
		kind: '#schema',
		args: [
			'ZCARD',
			key,
		],
	};
}
