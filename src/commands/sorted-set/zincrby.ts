import { doubleToNumber as replyTransform } from '../../reply-transformers/double-to-number.js';
import type { Command } from '../../types.js';

/**
 * Increments the score of `member` in the sorted set stored at `key` by `increment`.
 * If `member` does not exist in the sorted set, it is added with `increment` as its score (as if its previous score was `0.0`).
 * If `key` does not exist, a new sorted set with the specified `member` as its sole member is created.
 *
 * An error is returned when `key` exists but does not hold a sorted set.
 *
 * The `score` value should be the string representation of a numeric value, and accepts double precision floating point numbers.
 * It is possible to provide a negative value to decrement the score.
 * - Available since: 1.2.0.
 * - Time complexity: O(log(N)) where N is the number of elements in the sorted set.
 * @param key - The name of the key that holds the sorted set.
 * @param increment - The amount to add to the member's current score.
 * @param member - The member whose score to increment. It is added with the increment as its score if it does not exist.
 * @returns Bulk string reply: the new score of `member` as a double precision floating point number.
 * @see {@link https://redis.io/commands/zincrby}
 */
export function input(
	key: string,
	increment: number,
	member: string | number,
): Command<number> {
	return {
		kind: '#schema',
		args: ['ZINCRBY', key, String(increment), String(member)],
		replyTransform,
	};
}
