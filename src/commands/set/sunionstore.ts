import type { Command } from '../../types.js';
import { type Collection, collectionToStringArray } from '../../utils.js';

/**
 * This command is equal to `SUNION`, but instead of returning the resulting set, it is stored in `destination`.
 *
 * If `destination` already exists, it is overwritten.
 * - Available since: 1.0.0.
 * - Time complexity: O(N) where N is the total number of elements in all given sets.
 * @param destination - The key to store the resulting set in.
 * @param keys - One or more set keys to union.
 * @returns Integer reply: the number of elements in the resulting set.
 * @see {@link https://redis.io/commands/sunionstore}
 */
declare function _command(destination: string, ...keys: string[]): number;

/**
 * This command is equal to `SUNION`, but instead of returning the resulting set, it is stored in `destination`.
 *
 * If `destination` already exists, it is overwritten.
 * - Available since: 1.0.0.
 * - Time complexity: O(N) where N is the total number of elements in all given sets.
 * @param destination - The key to store the resulting set in.
 * @param keys - One or more set keys to union.
 * @returns Integer reply: the number of elements in the resulting set.
 * @see {@link https://redis.io/commands/sunionstore}
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
	const args = ['SUNIONSTORE', destination];

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
