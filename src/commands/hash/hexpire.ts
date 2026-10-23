import type { Command } from '../../types.js';
import { type Collection, collectionToStringArray } from '../../utils.js';

export type HexpireOptions = {
	/**
	 * For each specified field, set expiration only when the field has no expiration.
	 * - Incompatible with options `XX`, `GT` and `LT`.
	 * - Available since: 7.4.0.
	 */
	NX?: boolean;
	/**
	 * For each specified field, set expiration only when the field has an existing expiration.
	 * - Incompatible with options `NX`, `GT` and `LT`.
	 * - Available since: 7.4.0.
	 */
	XX?: boolean;
	/**
	 * For each specified field, set expiration only when the new expiration is greater than the current one. A non-volatile field is treated as an infinite TTL for the purposes of `GT`.
	 * - Incompatible with options `NX`, `XX` and `LT`.
	 * - Available since: 7.4.0.
	 */
	GT?: boolean;
	/**
	 * For each specified field, set expiration only when the new expiration is less than the current one. A non-volatile field is treated as an infinite TTL for the purposes of `LT`.
	 * - Incompatible with options `NX`, `XX` and `GT`.
	 * - Available since: 7.4.0.
	 */
	LT?: boolean;
};

/**
 * Set an expiration (TTL or time to live) on one or more fields of a given hash key. You must specify at least one field.
 * Field(s) will automatically be deleted from the hash key when their TTLs expire.
 *
 * Field expirations will only be cleared by commands that delete or overwrite the contents of the hash fields, including `HDEL` and `HSET` commands.
 * This means that all the operations that conceptually _alter_ the value stored at a hash key's field without replacing it with a new one will leave the TTL untouched.
 *
 * You can clear the TTL using the `HPERSIST` command, which turns the hash field back into a persistent field.
 *
 * Note that calling `HEXPIRE`/`HPEXPIRE` with a zero TTL or `HEXPIREAT`/`HPEXPIREAT` with a time in the past will result in the hash field being deleted.
 * - Available since: 7.4.0.
 * - Time complexity: O(N) where N is the number of specified fields.
 * @param key - The name of the key that holds the hash.
 * @param seconds - The time to live, in seconds. Each specified field is deleted after this many seconds.
 * @param fields - The hash fields to set expiration for.
 * @param options -
 * @returns Array reply. For each field:
 * - Integer reply: `-2` if no such field exists in the provided hash key, or the provided key does not exist.
 * - Integer reply: `0` if the specified NX | XX | GT | LT condition has not been met.
 * - Integer reply: `1` if the expiration time was set/updated.
 * - Integer reply: `2` when `HEXPIRE`/`HPEXPIRE` is called with 0 seconds/milliseconds or when `HEXPIREAT`/`HPEXPIREAT` is called with a past Unix time in seconds/milliseconds.
 * @see {@link https://redis.io/commands/hexpire}
 */
export function input(
	key: string,
	seconds: number,
	fields: Collection<string | number>,
	options?: HexpireOptions,
): Command<number[]> {
	const args = ['HEXPIRE', key, String(seconds)];

	if (options?.NX) {
		args.push('NX');
	}

	if (options?.XX) {
		args.push('XX');
	}

	if (options?.GT) {
		args.push('GT');
	}

	if (options?.LT) {
		args.push('LT');
	}

	const field_list = collectionToStringArray(fields);
	args.push('FIELDS', String(field_list.length), ...field_list);

	return {
		kind: '#schema',
		args,
	};
}
