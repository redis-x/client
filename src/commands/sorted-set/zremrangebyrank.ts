import type { Command } from '../../types.js';

/**
 * Removes all elements in the sorted set stored at `key` with rank between `start` and `stop`.
 * Both `start` and `stop` are `0` -based indexes with `0` being the element with the lowest score.
 * These indexes can be negative numbers, where they indicate offsets starting at the element with the highest score.
 * For example: `-1` is the element with the highest score, `-2` the element with the second highest score and so forth.
 * - Available since: 2.0.0.
 * - Time complexity: O(log(N)+M) with N being the number of elements in the sorted set and M the number of elements removed by the operation.
 * @param key - The name of the key that holds the sorted set.
 * @param start - The start index, zero-based. Negative values count from the end of the sorted set (`-1` is the member with the highest score).
 * @param stop - The stop index, zero-based and inclusive. Negative values count from the end of the sorted set.
 * @returns Integer reply: the number of members removed.
 * @see {@link https://redis.io/commands/zremrangebyrank}
 */
export function input(
	key: string,
	start: number,
	stop: number,
): Command<number> {
	return {
		kind: '#schema',
		args: ['ZREMRANGEBYRANK', key, String(start), String(stop)],
	};
}
