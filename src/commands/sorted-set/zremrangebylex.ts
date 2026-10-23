import type { Command } from '../../types.js';

/**
 * When all the elements in a sorted set are inserted with the same score, in order to force lexicographical ordering, this command removes all elements in the sorted set stored at `key` between the lexicographical range specified by `min` and `max`.
 *
 * The meaning of `min` and `max` are the same of the `ZRANGEBYLEX` command. Similarly, this command actually removes the same elements that `ZRANGEBYLEX` would return if called with the same `min` and `max` arguments.
 * - Available since: 2.8.9.
 * - Time complexity: O(log(N)+M) with N being the number of elements in the sorted set and M the number of elements removed by the operation.
 * @param key - The name of the key that holds the sorted set.
 * @param min - The minimum member, compared lexicographically. Prefix with `[` for an inclusive bound or `(` for an exclusive bound; use `-` for the lowest possible value.
 * @param max - The maximum member, compared lexicographically. Prefix with `[` for an inclusive bound or `(` for an exclusive bound; use `+` for the highest possible value.
 * @returns Integer reply: the number of members removed.
 * @see {@link https://redis.io/commands/zremrangebylex}
 */
export function input(
	key: string,
	min: `(${string}` | `[${string}` | '-',
	max: `(${string}` | `[${string}` | '+',
): Command<number> {
	return {
		kind: '#schema',
		args: ['ZREMRANGEBYLEX', key, min, max],
	};
}
