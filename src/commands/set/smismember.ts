import type { Command } from '../../types.js';
import { type Collection, collectionToStringArray } from '../../utils.js';

/**
 * Returns whether each member is a member of the set stored at key.
 *
 * For every member, 1 is returned if the value is a member of the set,
 * or 0 if the element is not a member of the set or if key does not exist.
 *
 * - Available since: 6.2.0.
 * - Time complexity: O(N) where N is the number of elements being checked for membership.
 * @param key The key of the set.
 * @param members The members to check.
 * @returns A list representing the membership of the given elements, in the same order as they are requested.
 * @see {@link https://redis.io/commands/smismember}
 */
declare function _command(
	key: string,
	...members: (string | number)[]
): boolean[];

/**
 * Returns whether each member is a member of the set stored at key.
 *
 * For every member, 1 is returned if the value is a member of the set,
 * or 0 if the element is not a member of the set or if key does not exist.
 *
 * - Available since: 6.2.0.
 * - Time complexity: O(N) where N is the number of elements being checked for membership.
 * @param key The name of the key that holds the set.
 * @param members One or more members to check for.
 * @returns A list representing the membership of the given elements, in the same order as they are requested.
 * @see {@link https://redis.io/commands/smismember}
 */
declare function _command(
	key: string,
	members: Collection<string | number>,
): boolean[];

// eslint-disable-next-line jsdoc/require-jsdoc
export function input(
	key: string,
	arg1: string | number | Collection<string | number>,
	...args_rest: (string | number)[]
): Command<boolean[]> {
	const args = ['SMISMEMBER', key];

	if (typeof arg1 === 'string' || typeof arg1 === 'number') {
		args.push(String(arg1), ...args_rest.map(String));
	} else {
		args.push(...collectionToStringArray(arg1));
	}

	return {
		kind: '#schema',
		args,
		replyTransform,
	};
}

/**
 * Converts an array of numbers (0 or 1) to an array of booleans.
 * @param reply The array of numbers to convert.
 * @returns An array of booleans where 1 becomes true and 0 becomes false.
 */
function replyTransform(reply: unknown[]): boolean[] {
	return reply.map((value) => value === 1);
}
