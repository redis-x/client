import type { Command } from '../../types.js';
import { type Collection, collectionToStringArray } from '../../utils.js';

/**
 * Like `HTTL`, this command returns the remaining TTL (time to live) of a field that has an expiration set, but in milliseconds instead of seconds.
 * - Available since: 7.4.0.
 * - Time complexity: O(N) where N is the number of specified fields.
 * @param key - The name of the key that holds the hash.
 * @param fields - The hash fields to retrieve the remaining time to live for.
 * @returns Array reply. For each field:
 * - Integer reply: `-2` if no such field exists in the provided hash key, or the provided key does not exist.
 * - Integer reply: `-1` if the field exists but has no associated expiration set.
 * - Integer reply: the TTL in milliseconds.
 * @see {@link https://redis.io/commands/hpttl}
 */
export function input(
	key: string,
	fields: Collection<string | number>,
): Command<number[]> {
	const field_list = collectionToStringArray(fields);

	return {
		kind: '#schema',
		args: ['HPTTL', key, 'FIELDS', String(field_list.length), ...field_list],
	};
}
