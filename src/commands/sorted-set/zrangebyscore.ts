import type { Command } from '../../types.js';

export type ZrangebyscoreOptions = {
	/**
	 * Returns only a specified range of elements. Start and count are zero-based indexes, inclusive.
	 * - Available since: 1.0.5.
	 */
	LIMIT?: [ number, number ],
};
export type ZrangebyscoreOptionsWithscores = {
	/**
	 * Specifies if the scores should also be returned.
	 * - Available since: 2.0.0.
	 */
	WITHSCORES: true,
};

/**
 * Returns all the elements in the sorted set at key with a score between min and max (including elements with score equal to min or max).
 * The elements are considered to be ordered from low to high scores.
 *
 * The elements having the same score are returned in lexicographical order.
 *
 * - Available since: 1.0.5.
 * - Time complexity: O(log(N)+M) with N being the number of elements in the sorted set and M the number of elements being returned. If M is constant (e.g. always asking for the first 10 elements with LIMIT), you can consider it O(log(N)).
 * @deprecated As of Redis version 6.2.0, this command is regarded as deprecated. It can be replaced by ZRANGE with the BYSCORE argument when migrating or writing new code.
 * @param key The key of the sorted set.
 * @param min The minimum score to consider.
 * @param max The maximum score to consider.
 * @param options Additional options for the command.
 * @returns Array of elements in the specified score range.
 * @see {@link https://redis.io/commands/zrangebyscore}
 */
declare function _command(
	key: string,
	min: number | `(${number}` | '-inf',
	max: number | `(${number}` | '+inf',
	options?: ZrangebyscoreOptions,
): string[];

/**
 * Returns all the elements in the sorted set at key with a score between min and max (including elements with score equal to min or max).
 * The elements are considered to be ordered from low to high scores.
 *
 * The elements having the same score are returned in lexicographical order.
 *
 * - Available since: 1.0.5.
 * - Time complexity: O(log(N)+M) with N being the number of elements in the sorted set and M the number of elements being returned. If M is constant (e.g. always asking for the first 10 elements with LIMIT), you can consider it O(log(N)).
 * @deprecated As of Redis version 6.2.0, this command is regarded as deprecated. It can be replaced by ZRANGE with the BYSCORE argument when migrating or writing new code.
 * @param key The key of the sorted set.
 * @param min The minimum score to consider.
 * @param max The maximum score to consider.
 * @param options Additional options for the command with WITHSCORES set to true.
 * @returns Array of elements with their scores in the specified score range.
 * @see {@link https://redis.io/commands/zrangebyscore}
 */
declare function _command(
	key: string,
	min: number | `(${number}` | '-inf',
	max: number | `(${number}` | '+inf',
	options: ZrangebyscoreOptions & ZrangebyscoreOptionsWithscores,
): {
	member: string,
	score: number,
}[];

// eslint-disable-next-line jsdoc/require-jsdoc
export function input(
	key: string,
	min: number | `(${number}` | '-inf',
	max: number | `(${number}` | '+inf',
	options?: ZrangebyscoreOptions & Partial<ZrangebyscoreOptionsWithscores>,
): Command {
	const args: string[] = [
		'ZRANGEBYSCORE',
		key,
		String(min),
		String(max),
	];

	if (options) {
		if (options.WITHSCORES) {
			args.push('WITHSCORES');
		}

		if (options.LIMIT) {
			args.push(
				'LIMIT',
				String(options.LIMIT[0]),
				String(options.LIMIT[1]),
			);
		}
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
						score: Number(result[index + 1]),
					});
				}

				return transformed_result;
			}

			return result;
		},
	};
}
