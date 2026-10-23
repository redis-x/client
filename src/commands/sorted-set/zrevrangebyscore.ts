import { doubleToNumber } from '../../reply-transformers/double-to-number.js';
import type { Command } from '../../types.js';

export type ZrevrangebyscoreOptions = {
	/**
	 * Also return the score of each member.
	 * - Available since: 2.2.0.
	 */
	WITHSCORES?: boolean;
	/**
	 * Skip `offset` matching members and return up to `count` of them. A negative `count` returns all remaining members.
	 * - Available since: 2.2.0.
	 */
	LIMIT?: [number, number];
};

/**
 * Returns all the elements in the sorted set at `key` with a score between `max` and `min` (including elements with score equal to `max` or `min`).
 * In contrary to the default ordering of sorted sets, for this command the elements are considered to be ordered from high to low scores.
 *
 * The elements having the same score are returned in reverse lexicographical order.
 *
 * Apart from the reversed ordering, `ZREVRANGEBYSCORE` is similar to `ZRANGEBYSCORE`.
 * - Available since: 2.2.0.
 * - Time complexity: O(log(N)+M) with N being the number of elements in the sorted set and M the number of elements being returned. If M is constant (e.g. always asking for the first 10 elements with LIMIT), you can consider it O(log(N)).
 * @deprecated As of Redis version 6.2.0, this command is regarded as deprecated. It can be replaced by ZRANGE with the REV and BYSCORE arguments when migrating or writing new code.
 * @param key - The name of the key that holds the sorted set.
 * @param max - The maximum score. The bound is inclusive unless prefixed with `(`. Use `+inf` for no upper bound.
 * @param min - The minimum score. The bound is inclusive unless prefixed with `(`. Use `-inf` for no lower bound.
 * @param options -
 * @returns Array reply: a list of the members and, optionally, their scores in the specified score range.
 * @see {@link https://redis.io/commands/zrevrangebyscore}
 */
declare function _command(
	key: string,
	max: number | `(${number}` | '+inf',
	min: number | `(${number}` | '-inf',
	options?: ZrevrangebyscoreOptions & { WITHSCORES?: false },
): string[];

/**
 * Returns all the elements in the sorted set at `key` with a score between `max` and `min` (including elements with score equal to `max` or `min`).
 * In contrary to the default ordering of sorted sets, for this command the elements are considered to be ordered from high to low scores.
 *
 * The elements having the same score are returned in reverse lexicographical order.
 *
 * Apart from the reversed ordering, `ZREVRANGEBYSCORE` is similar to `ZRANGEBYSCORE`.
 * - Available since: 2.2.0.
 * - Time complexity: O(log(N)+M) with N being the number of elements in the sorted set and M the number of elements being returned. If M is constant (e.g. always asking for the first 10 elements with LIMIT), you can consider it O(log(N)).
 * @deprecated As of Redis version 6.2.0, this command is regarded as deprecated. It can be replaced by ZRANGE with the REV and BYSCORE arguments when migrating or writing new code.
 * @param key - The name of the key that holds the sorted set.
 * @param max - The maximum score. The bound is inclusive unless prefixed with `(`. Use `+inf` for no upper bound.
 * @param min - The minimum score. The bound is inclusive unless prefixed with `(`. Use `-inf` for no lower bound.
 * @param options -
 * @returns Array reply: a list of the members and, optionally, their scores in the specified score range.
 * @see {@link https://redis.io/commands/zrevrangebyscore}
 */
declare function _command(
	key: string,
	max: number | `(${number}` | '+inf',
	min: number | `(${number}` | '-inf',
	options: ZrevrangebyscoreOptions & { WITHSCORES: true },
): {
	member: string;
	score: number;
}[];

/**
 * Returns all the elements in the sorted set at `key` with a score between `max` and `min` (including elements with score equal to `max` or `min`).
 * In contrary to the default ordering of sorted sets, for this command the elements are considered to be ordered from high to low scores.
 *
 * The elements having the same score are returned in reverse lexicographical order.
 *
 * Apart from the reversed ordering, `ZREVRANGEBYSCORE` is similar to `ZRANGEBYSCORE`.
 * - Available since: 2.2.0.
 * - Time complexity: O(log(N)+M) with N being the number of elements in the sorted set and M the number of elements being returned. If M is constant (e.g. always asking for the first 10 elements with LIMIT), you can consider it O(log(N)).
 * @deprecated As of Redis version 6.2.0, this command is regarded as deprecated. It can be replaced by ZRANGE with the REV and BYSCORE arguments when migrating or writing new code.
 * @param key - The name of the key that holds the sorted set.
 * @param max - The maximum score. The bound is inclusive unless prefixed with `(`. Use `+inf` for no upper bound.
 * @param min - The minimum score. The bound is inclusive unless prefixed with `(`. Use `-inf` for no lower bound.
 * @param options -
 * @returns Array reply: a list of the members and, optionally, their scores in the specified score range.
 * @see {@link https://redis.io/commands/zrevrangebyscore}
 */
declare function _command(
	key: string,
	max: number | `(${number}` | '+inf',
	min: number | `(${number}` | '-inf',
	options?: ZrevrangebyscoreOptions,
): string[] | { member: string; score: number }[];

// eslint-disable-next-line jsdoc/require-jsdoc
export function input(
	key: string,
	max: number | `(${number}` | '+inf',
	min: number | `(${number}` | '-inf',
	options?: ZrevrangebyscoreOptions,
): Command {
	const args = ['ZREVRANGEBYSCORE', key, String(max), String(min)];

	if (options?.WITHSCORES) {
		args.push('WITHSCORES');
	}

	if (options?.LIMIT) {
		args.push('LIMIT', String(options.LIMIT[0]), String(options.LIMIT[1]));
	}

	return {
		kind: '#schema',
		args,
		replyTransform(result: string[]) {
			if (options?.WITHSCORES) {
				const transformed_result = [];

				for (let index = 0; index < result.length; index += 2) {
					transformed_result.push({
						member: result[index],
						score: doubleToNumber(result[index + 1]!),
					});
				}

				return transformed_result;
			}

			return result;
		},
	};
}
