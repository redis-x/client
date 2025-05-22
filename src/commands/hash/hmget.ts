import type { Command } from '../../types.js';

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
declare function _command(key: string, fields: string[]): (string | null)[];

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
declare function _command(key: string, ...fields: string[]): (string | null)[];

// eslint-disable-next-line jsdoc/require-jsdoc
export function input(key: string, ...fields: (string | string[])[]): Command<(string | null)[]> {
	return {
		kind: '#schema',
		args: [
			'HMGET',
			key,
			...fields.flat(),
		],
	};
}
