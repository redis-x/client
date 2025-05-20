import type { Command } from '../../types.js';

export type ZrangeOptions = {
	/**
	 * Returns the range of elements from the sorted set having scores equal or between `<start>` and `<stop>`.
	 * - Available since: 6.2.0.
	 */
	BY?: 'SCORE' | 'LEX',
	/**
	 * Reverses the ordering, so elements are ordered from highest to lowest score, and score ties are resolved by reverse lexicographical ordering.
	 * - Available since: 6.2.0.
	 */
	REV?: boolean,
	/**
	 * Obtains a sub-range from the matching elements (similar to SELECT LIMIT offset, count in SQL). A negative `<count>` returns all elements from the `<offset>`.
	 * - Available since: 6.2.0.
	 */
	LIMIT?: [ number, number ],
	/**
	 * Supplements the command's reply with the scores of elements returned.
	 */
	WITHSCORES?: true,
};

/**
 * Returns the specified range of elements in the sorted set stored at key.
 * - Available since: 1.2.0
 * - Time complexity: O(log(N)+M) with N being the number of elements in the sorted set and M the number of elements returned.
 * @param key - Key that contains the hash.
 * @param start - Start index by default, minimum score if BY is `SCORE` or minimum lexicographical string if BY is `LEX`.
 * @param stop - Stop index by default, minimum score if BY is `SCORE` or minimum lexicographical string if BY is `LEX`.
 * @param options -
 * @returns List of members in the specified range.
 * @see {@link https://redis.io/commands/zrange}
 */
declare function _command(
	key: string,
	start: string | number,
	stop: string | number,
	options?: Omit<ZrangeOptions, 'WITHSCORES'>,
): string[];

/**
 * Returns the specified range of elements in the sorted set stored at key.
 * - Available since: 1.2.0
 * - Time complexity: O(log(N)+M) with N being the number of elements in the sorted set and M the number of elements returned.
 * @param key - Key that contains the hash.
 * @param start - Start index by default, minimum score if BY is `SCORE` or minimum lexicographical string if BY is `LEX`.
 * @param stop - Stop index by default, minimum score if BY is `SCORE` or minimum lexicographical string if BY is `LEX`.
 * @param options -
 * @returns List of members in the specified range with their scores.
 * @see {@link https://redis.io/commands/zrange}
 */
declare function _command(
	key: string,
	start: string | number,
	stop: string | number,
	options: ZrangeOptions,
): {
	member: string,
	score: number,
}[];

// eslint-disable-next-line jsdoc/require-jsdoc
export function input(
	key: string,
	start: string | number,
	stop: string | number,
	options?: ZrangeOptions,
): Command {
	const args = [
		'ZRANGE',
		key,
		String(start),
		String(stop),
	];

	if (options) {
		if (options.BY) {
			args.push(`BY${options.BY}`);
		}

		if (options.REV) {
			args.push('REV');
		}

		if (options.LIMIT) {
			args.push(
				'LIMIT',
				String(options.LIMIT[0]),
				String(options.LIMIT[1]),
			);
		}

		if (options.WITHSCORES) {
			args.push('WITHSCORES');
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
