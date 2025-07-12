import type { Command } from '../../types.js';

export type ZrankOptionsWithscore = {
	/**
	 * Returns the rank with the score of member represented as a string.
	 * - Available since: 7.2.0.
	 */
	WITHSCORE: true;
};

/**
 * Returns the rank of member in the sorted set stored at key, with the scores ordered from low to high.
 * The rank (or index) is 0-based, which means that the member with the lowest score has rank 0.
 *
 * - Available since: 2.0.0.
 * - Time complexity: O(log(N)).
 * @param key Key of the sorted set.
 * @param member Member to get the rank for.
 * @returns The rank of member if member exists in the sorted set, or null if member does not exist in the sorted set or key does not exist.
 * @see {@link https://redis.io/commands/zrank}
 */
declare function _command(key: string, member: string | number): number | null;

/**
 * Returns the rank of member in the sorted set stored at key, with the scores ordered from low to high.
 * The rank (or index) is 0-based, which means that the member with the lowest score has rank 0.
 *
 * - Available since: 2.0.0.
 * - Time complexity: O(log(N)).
 * @param key Key of the sorted set.
 * @param member Member to get the rank for.
 * @param options Command options.
 * @returns The rank and score of member if member exists in the sorted set, or null if member does not exist in the sorted set or key does not exist.
 * @see {@link https://redis.io/commands/zrank}
 */
declare function _command(
	key: string,
	member: string | number,
	options: ZrankOptionsWithscore,
): {
	rank: number;
	score: number;
} | null;

// eslint-disable-next-line jsdoc/require-jsdoc
export function input(
	key: string,
	member: string | number,
	options?: Partial<ZrankOptionsWithscore>,
): Command {
	const args = ['ZRANK', key, String(member)];

	if (options?.WITHSCORE) {
		args.push('WITHSCORE');
	}

	return {
		kind: '#schema',
		args,
		replyTransform(result) {
			if (result === null) {
				return null;
			}

			if (options?.WITHSCORE) {
				const [rank, score] = result as [number, string];
				return {
					rank,
					score: Number.parseFloat(score),
				};
			}

			return result;
		},
	};
}
