import type { Command } from '../../types.js';
import { type Collection, collectionToStringArray } from '../../utils.js';

/**
 * Removes the specified fields from the hash stored at key. Specified fields that do not exist within this hash are ignored.
 * Deletes the hash if no fields remain. If key does not exist, it is treated as an empty hash and this command returns 0.
 *
 * - Available since: 2.0.0. Multiple field arguments support added in 2.4.0.
 * - Time complexity: O(N) where N is the number of fields to be removed.
 * @param key Key of the hash.
 * @param fields One or more fields to delete from the hash.
 * @returns The number of fields that were removed from the hash, excluding specified but non-existing fields.
 * @see {@link https://redis.io/commands/hdel}
 */
declare function _command(
	key: string,
	fields: Collection<string | number>,
): number;

/**
 * Removes the specified fields from the hash stored at key. Specified fields that do not exist within this hash are ignored.
 * Deletes the hash if no fields remain. If key does not exist, it is treated as an empty hash and this command returns 0.
 *
 * - Available since: 2.0.0. Multiple field arguments support added in 2.4.0.
 * - Time complexity: O(N) where N is the number of fields to be removed.
 * @param key Key of the hash.
 * @param fields Fields to remove from the hash.
 * @returns The number of fields that were removed from the hash, excluding specified but non-existing fields.
 * @see {@link https://redis.io/commands/hdel}
 */
declare function _command(key: string, ...fields: (string | number)[]): number;

// eslint-disable-next-line jsdoc/require-jsdoc
export function input(
	key: string,
	arg1: string | number | Collection<string | number>,
	...args_rest: (string | number)[]
): Command<number> {
	const args = ['HDEL', key];

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
