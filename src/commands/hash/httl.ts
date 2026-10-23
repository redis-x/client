import type { Command } from '../../types.js';
import { type Collection, collectionToStringArray } from '../../utils.js';

/**
 * Returns the remaining TTL (time to live) of a hash key's field(s) that have a set expiration.
 * This introspection capability allows you to check how many seconds a given hash field will continue to be part of the hash key.
 *
 * See also the `HPTTL` command that returns the same information with millisecond resolution.
 * - Available since: 7.4.0.
 * - Time complexity: O(N) where N is the number of specified fields.
 * @param key - The name of the key that holds the hash.
 * @param fields - The hash fields to retrieve the remaining time to live for.
 * @returns Array reply. For each field:
 * - Integer reply: `-2` if no such field exists in the provided hash key, or the provided key does not exist.
 * - Integer reply: `-1` if the field exists but has no associated expiration set.
 * - Integer reply: the TTL in seconds.
 * @see {@link https://redis.io/commands/httl}
 */
export function input(
	key: string,
	fields: Collection<string | number>,
): Command<number[]> {
	const field_list = collectionToStringArray(fields);

	return {
		kind: '#schema',
		args: ['HTTL', key, 'FIELDS', String(field_list.length), ...field_list],
	};
}
