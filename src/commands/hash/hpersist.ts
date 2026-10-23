import type { Command } from '../../types.js';
import { type Collection, collectionToStringArray } from '../../utils.js';

/**
 * Remove the existing expiration on a hash key's field(s), turning the field(s) from _volatile_ (a field with expiration set) to _persistent_ (a field that will never expire as no TTL (time to live) is associated).
 * - Available since: 7.4.0.
 * - Time complexity: O(N) where N is the number of specified fields.
 * @param key - The name of the key that holds the hash.
 * @param fields - The hash fields to remove the expiration from.
 * @returns Array reply. For each field:
 * - Integer reply: `-2` if no such field exists in the provided hash key, or the provided key does not exist.
 * - Integer reply: `-1` if the field exists but has no associated expiration set.
 * - Integer reply: `1` the expiration was removed.
 * @see {@link https://redis.io/commands/hpersist}
 */
export function input(
	key: string,
	fields: Collection<string | number>,
): Command<number[]> {
	const field_list = collectionToStringArray(fields);

	return {
		kind: '#schema',
		args: ['HPERSIST', key, 'FIELDS', String(field_list.length), ...field_list],
	};
}
