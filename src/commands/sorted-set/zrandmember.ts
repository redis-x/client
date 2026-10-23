import { doubleToNumber } from '../../reply-transformers/double-to-number.js';
import type { Command } from '../../types.js';

export type ZrandmemberOptions = {
	/**
	 * Also return the score of each returned member. Can only be used together with `count`.
	 * - Available since: 6.2.0.
	 */
	WITHSCORES?: boolean;
};

/**
 * When called with just the `key` argument, return a random element from the sorted set value stored at `key`.
 * - Available since: 6.2.0.
 * - Time complexity: O(N) where N is the number of members returned.
 * @param key - The name of the key that holds the sorted set.
 * @returns Bulk string reply: without the additional _count_ argument, the command returns a randomly selected member, or Nil reply when _key_ doesn't exist.
 * @see {@link https://redis.io/commands/zrandmember}
 */
declare function _command(key: string): string | null;

/**
 * If the provided `count` argument is positive, return an array of distinct elements.
 * The array's length is either `count` or the sorted set's cardinality (`ZCARD`), whichever is lower.
 *
 * If called with a negative `count`, the behavior changes and the command is allowed to return the same element multiple times.
 * In this case, the number of returned elements is the absolute value of the specified `count`.
 * - Available since: 6.2.0.
 * - Time complexity: O(N) where N is the number of members returned.
 * @param key - The name of the key that holds the sorted set.
 * @param count - The number of members to return. A positive `count` returns up to that many distinct members; a negative `count` returns exactly `|count|` members and may repeat them.
 * @param options -
 * @returns Array reply: when the additional _count_ argument is passed, the command returns an array of members, or an empty array when _key_ doesn't exist.
 * @see {@link https://redis.io/commands/zrandmember}
 */
declare function _command(
	key: string,
	count: number,
	options?: ZrandmemberOptions & { WITHSCORES?: false },
): string[];

/**
 * If the provided `count` argument is positive, return an array of distinct elements.
 * The array's length is either `count` or the sorted set's cardinality (`ZCARD`), whichever is lower.
 *
 * If called with a negative `count`, the behavior changes and the command is allowed to return the same element multiple times.
 * In this case, the number of returned elements is the absolute value of the specified `count`.
 *
 * The optional `WITHSCORES` modifier changes the reply so it includes the respective scores of the randomly selected elements from the sorted set.
 * - Available since: 6.2.0.
 * - Time complexity: O(N) where N is the number of members returned.
 * @param key - The name of the key that holds the sorted set.
 * @param count - The number of members to return. A positive `count` returns up to that many distinct members; a negative `count` returns exactly `|count|` members and may repeat them.
 * @param options -
 * @returns Array reply: when the additional _count_ argument is passed, the command returns an array of members, or an empty array when _key_ doesn't exist. If the _WITHSCORES_ modifier is used, the reply is a list of members and their scores from the sorted set.
 * @see {@link https://redis.io/commands/zrandmember}
 */
declare function _command(
	key: string,
	count: number,
	options: ZrandmemberOptions & { WITHSCORES: true },
): {
	member: string;
	score: number;
}[];

/**
 * If the provided `count` argument is positive, return an array of distinct elements.
 * The array's length is either `count` or the sorted set's cardinality (`ZCARD`), whichever is lower.
 *
 * If called with a negative `count`, the behavior changes and the command is allowed to return the same element multiple times.
 * In this case, the number of returned elements is the absolute value of the specified `count`.
 *
 * The optional `WITHSCORES` modifier changes the reply so it includes the respective scores of the randomly selected elements from the sorted set.
 * - Available since: 6.2.0.
 * - Time complexity: O(N) where N is the number of members returned.
 * @param key - The name of the key that holds the sorted set.
 * @param count - The number of members to return. A positive `count` returns up to that many distinct members; a negative `count` returns exactly `|count|` members and may repeat them.
 * @param options -
 * @returns Array reply: when the additional _count_ argument is passed, the command returns an array of members, or an empty array when _key_ doesn't exist. If the _WITHSCORES_ modifier is used, the reply is a list of members and their scores from the sorted set.
 * @see {@link https://redis.io/commands/zrandmember}
 */
declare function _command(
	key: string,
	count: number,
	options?: ZrandmemberOptions,
): string[] | { member: string; score: number }[];

// eslint-disable-next-line jsdoc/require-jsdoc
export function input(
	key: string,
	count?: number,
	options?: ZrandmemberOptions,
): Command {
	const args = ['ZRANDMEMBER', key];
	const has_withscores = count !== undefined && options?.WITHSCORES === true;

	if (count !== undefined) {
		args.push(String(count));
	}

	if (has_withscores) {
		args.push('WITHSCORES');
	}

	return {
		kind: '#schema',
		args,
		replyTransform(result: string | string[] | null) {
			if (has_withscores) {
				const reply = result as string[];
				const transformed_result = [];

				for (let index = 0; index < reply.length; index += 2) {
					transformed_result.push({
						member: reply[index],
						score: doubleToNumber(reply[index + 1]!),
					});
				}

				return transformed_result;
			}

			return result;
		},
	};
}
