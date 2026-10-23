import type { Command } from '../../types.js';
import { type Collection, collectionToStringArray } from '../../utils.js';

/**
 * Returns the absolute Unix timestamp in seconds since Unix epoch at which the given key's field(s) will expire.
 *
 * See also the `HPEXPIRETIME` command, which returns the same information with millisecond resolution.
 * - Available since: 7.4.0.
 * - Time complexity: O(N) where N is the number of specified fields.
 * @param key - The name of the key that holds the hash.
 * @param fields - The hash fields to retrieve the expiration time for.
 * @returns Array reply. For each field:
 * - Integer reply: `-2` if no such field exists in the provided hash key, or the provided key does not exist.
 * - Integer reply: `-1` if the field exists but has no associated expiration set.
 * - Integer reply: the expiration (Unix timestamp) in seconds.
 * @see {@link https://redis.io/commands/hexpiretime}
 */
export function input(
	key: string,
	fields: Collection<string | number>,
): Command<number[]> {
	const field_list = collectionToStringArray(fields);

	return {
		kind: '#schema',
		args: [
			'HEXPIRETIME',
			key,
			'FIELDS',
			String(field_list.length),
			...field_list,
		],
	};
}
