import type { Command } from '../../types.js';

export type ZrevrangebylexOptions = {
	/**
	 * Skip `offset` matching members and return up to `count` of them. A negative `count` returns all remaining members.
	 * - Available since: 2.8.9.
	 */
	LIMIT?: [number, number];
};

/**
 * When all the elements in a sorted set are inserted with the same score, in order to force lexicographical ordering, this command returns all the elements in the sorted set at `key` with a value between `max` and `min`.
 *
 * Apart from the reversed ordering, `ZREVRANGEBYLEX` is similar to `ZRANGEBYLEX`.
 * - Available since: 2.8.9.
 * - Time complexity: O(log(N)+M) with N being the number of elements in the sorted set and M the number of elements being returned. If M is constant (e.g. always asking for the first 10 elements with LIMIT), you can consider it O(log(N)).
 * @deprecated As of Redis version 6.2.0, this command is regarded as deprecated. It can be replaced by ZRANGE with the REV and BYLEX arguments when migrating or writing new code.
 * @param key - The name of the key that holds the sorted set.
 * @param max - The maximum member, compared lexicographically. Prefix with `[` for an inclusive bound or `(` for an exclusive bound; use `+` for the highest possible value.
 * @param min - The minimum member, compared lexicographically. Prefix with `[` for an inclusive bound or `(` for an exclusive bound; use `-` for the lowest possible value.
 * @param options -
 * @returns Array reply: a list of members in the specified lexicographical range.
 * @see {@link https://redis.io/commands/zrevrangebylex}
 */
export function input(
	key: string,
	max: `(${string}` | `[${string}` | '+',
	min: `(${string}` | `[${string}` | '-',
	options?: ZrevrangebylexOptions,
): Command<string[]> {
	const args = ['ZREVRANGEBYLEX', key, max, min];

	if (options?.LIMIT) {
		args.push('LIMIT', String(options.LIMIT[0]), String(options.LIMIT[1]));
	}

	return {
		kind: '#schema',
		args,
	};
}
