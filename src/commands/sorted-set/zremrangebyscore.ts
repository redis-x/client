import type { Command } from '../../types.js';

/**
 * Removes all elements in the sorted set stored at `key` with a score between `min` and `max` (inclusive).
 * - Available since: 1.2.0.
 * - Time complexity: O(log(N)+M) with N being the number of elements in the sorted set and M the number of elements removed by the operation.
 * @param key - The name of the key that holds the sorted set.
 * @param min - The minimum score. The bound is inclusive unless prefixed with `(`. Use `-inf` for no lower bound.
 * @param max - The maximum score. The bound is inclusive unless prefixed with `(`. Use `+inf` for no upper bound.
 * @returns Integer reply: the number of members removed.
 * @see {@link https://redis.io/commands/zremrangebyscore}
 */
export function input(
	key: string,
	min: number | `(${number}` | '-inf',
	max: number | `(${number}` | '+inf',
): Command<number> {
	return {
		kind: '#schema',
		args: ['ZREMRANGEBYSCORE', key, String(min), String(max)],
	};
}
