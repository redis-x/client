import type { Command } from '../../types.js';
import { type Collection, collectionToStringArray } from '../../utils.js';

/**
 * Remove the specified members from the set stored at key.
 * Specified members that are not a member of this set are ignored.
 * If key does not exist, it is treated as an empty set and this command returns 0.
 *
 * - Available since: 1.0.0. Multiple members support added in 2.4.0.
 * - Time complexity: O(N) where N is the number of members to be removed.
 * @param key Key of the set.
 * @param members One or more members to remove from the set.
 * @returns The number of members that were removed from the set, not including non existing members.
 * @see {@link https://redis.io/commands/srem}
 */
declare function _command(
	key: string,
	members: Collection<string | number>,
): number;

/**
 * Remove the specified members from the set stored at key.
 * Specified members that are not a member of this set are ignored.
 * If key does not exist, it is treated as an empty set and this command returns 0.
 *
 * - Available since: 1.0.0. Multiple members support added in 2.4.0.
 * - Time complexity: O(N) where N is the number of members to be removed.
 * @param key Key of the set.
 * @param members Members to remove from the set.
 * @returns The number of members that were removed from the set, not including non existing members.
 * @see {@link https://redis.io/commands/srem}
 */
declare function _command(key: string, ...members: (string | number)[]): number;

// eslint-disable-next-line jsdoc/require-jsdoc
export function input(
	key: string,
	arg1: string | number | Collection<string | number>,
	...args_rest: (string | number)[]
): Command<number> {
	const args = ['SREM', key];

	if (typeof arg1 === 'string' || typeof arg1 === 'number') {
		args.push(String(arg1), ...args_rest.map(String));
	} else {
		args.push(...collectionToStringArray(arg1));
	}

	return {
		kind: '#schema',
		args,
	};
}
