import type { Command } from '../../types.js';

/**
 * Add the specified members to the set stored at key.
 * Specified members that are already a member of this set are ignored.
 * If key does not exist, a new set is created before adding the specified members.
 *
 * An error is returned when the value stored at key is not a set.
 *
 * - Available since: 1.0.0. Multiple members support added in 2.4.0.
 * - Time complexity: O(1) for each element added.
 * @param key Key of the set.
 * @param member Member to add to the set.
 * @returns The number of elements that were added to the set, not including all the elements already present in the set.
 * @see {@link https://redis.io/commands/sadd}
 */
declare function _command(key: string, member: (string | number)[]): number;

/**
 * Add the specified members to the set stored at key.
 * Specified members that are already a member of this set are ignored.
 * If key does not exist, a new set is created before adding the specified members.
 *
 * An error is returned when the value stored at key is not a set.
 *
 * - Available since: 1.0.0. Multiple members support added in 2.4.0.
 * - Time complexity: O(1) for each element added.
 * @param key Key of the set.
 * @param members Members to add to the set.
 * @returns The number of elements that were added to the set, not including all the elements already present in the set.
 * @see {@link https://redis.io/commands/sadd}
 */
declare function _command(key: string, ...members: (string | number)[]): number;

// eslint-disable-next-line jsdoc/require-jsdoc
export function input(key: string, ...members: (string | number | (string | number)[])[]): Command<number> {
	return {
		kind: '#schema',
		args: [
			'SADD',
			key,
			...members.flat().map(String),
		],
	};
}
