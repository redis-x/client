import type { Command } from '../../types.js';
import { type Collection, collectionToStringArray } from '../../utils.js';

/**
 * This command is equal to `SINTER`, but instead of returning the resulting set, it is stored in `destination`.
 *
 * If `destination` already exists, it is overwritten.
 * - Available since: 1.0.0.
 * - Time complexity: O(N*M) worst case where N is the cardinality of the smallest set and M is the number of sets.
 * @param destination - The key to store the resulting set in.
 * @param keys - One or more set keys to intersect.
 * @returns Integer reply: the number of elements in the resulting set.
 * @see {@link https://redis.io/commands/sinterstore}
 */
declare function _command(destination: string, ...keys: string[]): number;

/**
 * This command is equal to `SINTER`, but instead of returning the resulting set, it is stored in `destination`.
 *
 * If `destination` already exists, it is overwritten.
 * - Available since: 1.0.0.
 * - Time complexity: O(N*M) worst case where N is the cardinality of the smallest set and M is the number of sets.
 * @param destination - The key to store the resulting set in.
 * @param keys - One or more set keys to intersect.
 * @returns Integer reply: the number of elements in the resulting set.
 * @see {@link https://redis.io/commands/sinterstore}
 */
declare function _command(
	destination: string,
	keys: Collection<string>,
): number;

// eslint-disable-next-line jsdoc/require-jsdoc
export function input(
	destination: string,
	arg1: string | Collection<string>,
	...args_rest: string[]
): Command<number> {
	const args = ['SINTERSTORE', destination];

	if (typeof arg1 === 'string') {
		args.push(arg1, ...args_rest);
	} else {
		args.push(...collectionToStringArray(arg1));
	}

	return {
		kind: '#schema',
		args,
	};
}
