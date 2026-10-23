import { arrayToSet as replyTransform } from '../../reply-transformers/array-to-set.js';
import type { Command } from '../../types.js';
import { type Collection, collectionToStringArray } from '../../utils.js';

/**
 * Returns the members of the set resulting from the union of all the given sets.
 *
 * Keys that do not exist are considered to be empty sets.
 * - Available since: 1.0.0.
 * - Time complexity: O(N) where N is the total number of elements in all given sets.
 * @param keys - One or more set keys to union.
 * @returns Array reply: a list with members of the resulting set.
 * @see {@link https://redis.io/commands/sunion}
 */
declare function _command(...keys: string[]): Set<string>;

/**
 * Returns the members of the set resulting from the union of all the given sets.
 *
 * Keys that do not exist are considered to be empty sets.
 * - Available since: 1.0.0.
 * - Time complexity: O(N) where N is the total number of elements in all given sets.
 * @param keys - One or more set keys to union.
 * @returns Array reply: a list with members of the resulting set.
 * @see {@link https://redis.io/commands/sunion}
 */
declare function _command(keys: Collection<string>): Set<string>;

// eslint-disable-next-line jsdoc/require-jsdoc
export function input(
	arg0: string | Collection<string>,
	...args_rest: string[]
): Command<Set<string>> {
	const args = ['SUNION'];

	if (typeof arg0 === 'string') {
		args.push(arg0, ...args_rest);
	} else {
		args.push(...collectionToStringArray(arg0));
	}

	return {
		kind: '#schema',
		args,
		replyTransform,
	};
}
