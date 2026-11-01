import type { Command } from '../../types.js';
import { type Collection, collectionToStringArray } from '../../utils.js';

/**
 * Returns the values associated with the specified fields in the hash stored at key.
 *
 * For every field that does not exist in the hash, a nil value is returned.
 * Because non-existing keys are treated as empty hashes, running HMGET against a non-existing key will return a list of nil values.
 *
 * - Available since: 2.0.0.
 * - Time complexity: O(N) where N is the number of fields being requested.
 * @param key Key holding the hash.
 * @param fields Fields to get.
 * @returns Array of values associated with the given fields, in the same order as they are requested.
 * @see {@link https://redis.io/commands/hmget}
 */
declare function _command(
	key: string,
	fields: Collection<string | number>,
): (string | null)[];

/**
 * Returns the values associated with the specified fields in the hash stored at key.
 *
 * For every field that does not exist in the hash, a nil value is returned.
 * Because non-existing keys are treated as empty hashes, running HMGET against a non-existing key will return a list of nil values.
 *
 * - Available since: 2.0.0.
 * - Time complexity: O(N) where N is the number of fields being requested.
 * @param key Key holding the hash.
 * @param fields Fields to get.
 * @returns Array of values associated with the given fields, in the same order as they are requested.
 * @see {@link https://redis.io/commands/hmget}
 */
declare function _command(
	key: string,
	...fields: (string | number)[]
): (string | null)[];

// eslint-disable-next-line jsdoc/require-jsdoc
export function input(
	key: string,
	arg1: string | number | Collection<string | number>,
	...args_rest: (string | number)[]
): Command<(string | null)[]> {
	const args = ['HMGET', key];

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
