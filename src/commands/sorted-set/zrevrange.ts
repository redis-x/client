import { doubleToNumber } from '../../reply-transformers/double-to-number.js';
import type { Command } from '../../types.js';

export type ZrevrangeOptions = {
	/**
	 * Also return the score of each member.
	 * - Available since: 1.2.0.
	 */
	WITHSCORES?: boolean;
};

/**
 * Returns the specified range of elements in the sorted set stored at `key`.
 * The elements are considered to be ordered from the highest to the lowest score.
 * Descending lexicographical order is used for elements with equal score.
 *
 * Apart from the reversed ordering, `ZREVRANGE` is similar to `ZRANGE`.
 * - Available since: 1.2.0.
 * - Time complexity: O(log(N)+M) with N being the number of elements in the sorted set and M the number of elements returned.
 * @deprecated As of Redis version 6.2.0, this command is regarded as deprecated. It can be replaced by ZRANGE with the REV argument when migrating or writing new code.
 * @param key - The name of the key that holds the sorted set.
 * @param start - The start index, zero-based. Negative values count from the end of the sorted set (`-1` is the member with the highest score).
 * @param stop - The stop index, zero-based and inclusive. Negative values count from the end of the sorted set.
 * @param options -
 * @returns Array reply: a list of members in the specified range, optionally with their scores if _WITHSCORES_ was used.
 * @see {@link https://redis.io/commands/zrevrange}
 */
declare function _command(
	key: string,
	start: number,
	stop: number,
	options?: ZrevrangeOptions & { WITHSCORES?: false },
): string[];

/**
 * Returns the specified range of elements in the sorted set stored at `key`.
 * The elements are considered to be ordered from the highest to the lowest score.
 * Descending lexicographical order is used for elements with equal score.
 *
 * Apart from the reversed ordering, `ZREVRANGE` is similar to `ZRANGE`.
 * - Available since: 1.2.0.
 * - Time complexity: O(log(N)+M) with N being the number of elements in the sorted set and M the number of elements returned.
 * @deprecated As of Redis version 6.2.0, this command is regarded as deprecated. It can be replaced by ZRANGE with the REV argument when migrating or writing new code.
 * @param key - The name of the key that holds the sorted set.
 * @param start - The start index, zero-based. Negative values count from the end of the sorted set (`-1` is the member with the highest score).
 * @param stop - The stop index, zero-based and inclusive. Negative values count from the end of the sorted set.
 * @param options -
 * @returns Array reply: a list of members in the specified range, optionally with their scores if _WITHSCORES_ was used.
 * @see {@link https://redis.io/commands/zrevrange}
 */
declare function _command(
	key: string,
	start: number,
	stop: number,
	options: ZrevrangeOptions & { WITHSCORES: true },
): {
	member: string;
	score: number;
}[];

/**
 * Returns the specified range of elements in the sorted set stored at `key`.
 * The elements are considered to be ordered from the highest to the lowest score.
 * Descending lexicographical order is used for elements with equal score.
 *
 * Apart from the reversed ordering, `ZREVRANGE` is similar to `ZRANGE`.
 * - Available since: 1.2.0.
 * - Time complexity: O(log(N)+M) with N being the number of elements in the sorted set and M the number of elements returned.
 * @deprecated As of Redis version 6.2.0, this command is regarded as deprecated. It can be replaced by ZRANGE with the REV argument when migrating or writing new code.
 * @param key - The name of the key that holds the sorted set.
 * @param start - The start index, zero-based. Negative values count from the end of the sorted set (`-1` is the member with the highest score).
 * @param stop - The stop index, zero-based and inclusive. Negative values count from the end of the sorted set.
 * @param options -
 * @returns Array reply: a list of members in the specified range, optionally with their scores if _WITHSCORES_ was used.
 * @see {@link https://redis.io/commands/zrevrange}
 */
declare function _command(
	key: string,
	start: number,
	stop: number,
	options?: ZrevrangeOptions,
): string[] | { member: string; score: number }[];

// eslint-disable-next-line jsdoc/require-jsdoc
export function input(
	key: string,
	start: number,
	stop: number,
	options?: ZrevrangeOptions,
): Command {
	const args = ['ZREVRANGE', key, String(start), String(stop)];

	if (options?.WITHSCORES) {
		args.push('WITHSCORES');
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
