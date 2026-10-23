import { doubleToNumber } from '../../reply-transformers/double-to-number.js';
import type { Command } from '../../types.js';

export type ZrevrankOptions = {
	/**
	 * Also return the member's score along with its rank.
	 * - Available since: 7.2.0.
	 */
	WITHSCORE?: boolean;
};

/**
 * Returns the rank of `member` in the sorted set stored at `key`, with the scores ordered from high to low.
 * The rank (or index) is 0-based, which means that the member with the highest score has rank `0`.
 * - Available since: 2.0.0.
 * - Time complexity: O(log(N)).
 * @param key - The name of the key that holds the sorted set.
 * @param member - The member whose rank to return.
 * @param options -
 * @returns Any of the following:
 * - Nil reply: if the key does not exist or the member does not exist in the sorted set.
 * - Integer reply: The rank of the member when _WITHSCORE_ is not used.
 * @see {@link https://redis.io/commands/zrevrank}
 */
declare function _command(
	key: string,
	member: string | number,
	options?: ZrevrankOptions & { WITHSCORE?: false },
): number | null;

/**
 * Returns the rank of `member` in the sorted set stored at `key`, with the scores ordered from high to low.
 * The rank (or index) is 0-based, which means that the member with the highest score has rank `0`.
 *
 * The optional `WITHSCORE` argument supplements the command's reply with the score of the element returned.
 * - Available since: 2.0.0.
 * - Starting with Redis version 7.2.0: Added the optional `WITHSCORE` argument.
 * - Time complexity: O(log(N)).
 * @param key - The name of the key that holds the sorted set.
 * @param member - The member whose rank to return.
 * @param options -
 * @returns Any of the following:
 * - Nil reply: if the key does not exist or the member does not exist in the sorted set.
 * - Array reply: The rank and score of the member when _WITHSCORE_ is used.
 * @see {@link https://redis.io/commands/zrevrank}
 */
declare function _command(
	key: string,
	member: string | number,
	options: ZrevrankOptions & { WITHSCORE: true },
): {
	rank: number;
	score: number;
} | null;

/**
 * Returns the rank of `member` in the sorted set stored at `key`, with the scores ordered from high to low.
 * The rank (or index) is 0-based, which means that the member with the highest score has rank `0`.
 *
 * The optional `WITHSCORE` argument supplements the command's reply with the score of the element returned.
 * - Available since: 2.0.0.
 * - Starting with Redis version 7.2.0: Added the optional `WITHSCORE` argument.
 * - Time complexity: O(log(N)).
 * @param key - The name of the key that holds the sorted set.
 * @param member - The member whose rank to return.
 * @param options -
 * @returns Any of the following:
 * - Nil reply: if the key does not exist or the member does not exist in the sorted set.
 * - Integer reply: The rank of the member when _WITHSCORE_ is not used.
 * - Array reply: The rank and score of the member when _WITHSCORE_ is used.
 * @see {@link https://redis.io/commands/zrevrank}
 */
declare function _command(
	key: string,
	member: string | number,
	options?: ZrevrankOptions,
):
	| number
	| {
			rank: number;
			score: number;
	  }
	| null;

// eslint-disable-next-line jsdoc/require-jsdoc
export function input(
	key: string,
	member: string | number,
	options?: ZrevrankOptions,
): Command {
	const args = ['ZREVRANK', key, String(member)];

	if (options?.WITHSCORE) {
		args.push('WITHSCORE');
	}

	return {
		kind: '#schema',
		args,
		replyTransform(result: number | [number, string] | null) {
			if (result === null) {
				return null;
			}

			if (options?.WITHSCORE) {
				const [rank, score] = result as [number, string];
				return {
					rank,
					score: doubleToNumber(score),
				};
			}

			return result;
		},
	};
}
