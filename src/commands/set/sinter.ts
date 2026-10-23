import { arrayToSet as replyTransform } from '../../reply-transformers/array-to-set.js';
import type { Command } from '../../types.js';
import { type Collection, collectionToStringArray } from '../../utils.js';

/**
 * Returns the members of the set resulting from the intersection of all the given sets.
 *
 * Keys that do not exist are considered to be empty sets.
 * With one of the keys being an empty set, the resulting set is also empty (since set intersection with an empty set always results in an empty set).
 * - Available since: 1.0.0.
 * - Time complexity: O(N*M) worst case where N is the cardinality of the smallest set and M is the number of sets.
 * @param keys - One or more set keys to intersect.
 * @returns Array reply: an array with the members of the resulting set.
 * @see {@link https://redis.io/commands/sinter}
 */
declare function _command(...keys: string[]): Set<string>;

/**
 * Returns the members of the set resulting from the intersection of all the given sets.
 *
 * Keys that do not exist are considered to be empty sets.
 * With one of the keys being an empty set, the resulting set is also empty (since set intersection with an empty set always results in an empty set).
 * - Available since: 1.0.0.
 * - Time complexity: O(N*M) worst case where N is the cardinality of the smallest set and M is the number of sets.
 * @param keys - One or more set keys to intersect.
 * @returns Array reply: an array with the members of the resulting set.
 * @see {@link https://redis.io/commands/sinter}
 */
declare function _command(keys: Collection<string>): Set<string>;

// eslint-disable-next-line jsdoc/require-jsdoc
export function input(
	arg0: string | Collection<string>,
	...args_rest: string[]
): Command<Set<string>> {
	const args = ['SINTER'];

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
