import type { Command } from '../../types.js';

/**
 * Returns whether each member is a member of the set stored at key.
 *
 * For every member, `true` is returned if the value is a member of the set,
 * or `false` if the element is not a member of the set or if key does not exist.
 *
 * - Available since: 6.2.0.
 * - Time complexity: O(N) where N is the number of elements being checked for membership.
 * @param key The key of the set.
 * @param members The members to check.
 * @returns An array of booleans, representing the membership of the given elements in the same order as they are requested.
 * @see {@link https://redis.io/commands/smismember}
 */
export function input(key: string, ...members: string[]): Command<boolean[]> {
	return {
		kind: '#schema',
		args: ['SMISMEMBER', key, ...members],
		replyTransform,
	};
}

/**
 * Converts an array of numbers (0 or 1) to an array of booleans.
 * @param reply The array of numbers to convert.
 * @returns An array of booleans where 1 becomes true and 0 becomes false.
 */
function replyTransform(reply: (0 | 1)[]): boolean[] {
	return reply.map((value) => value === 1);
}
