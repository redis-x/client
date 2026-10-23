import type { Command } from '../../types.js';
import { type Collection, collectionToStringArray } from '../../utils.js';

export type HpexpireatOptions = {
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
 * `HPEXPIREAT` has the same effect and semantics as `HEXPIREAT`, but the Unix time at which the field will expire is specified in milliseconds since Unix epoch instead of seconds.
 * - Available since: 7.4.0.
 * - Time complexity: O(N) where N is the number of specified fields.
 * @param key - The name of the key that holds the hash.
 * @param timestamp - The absolute Unix expiration timestamp, in milliseconds since Unix epoch. A timestamp in the past deletes the field immediately.
 * @param fields - The hash fields to operate on.
 * @param options -
 * @returns Array reply. For each field:
 * - Integer reply: `-2` if no such field exists in the provided hash key, or the provided key does not exist.
 * - Integer reply: `0` if the specified NX | XX | GT | LT condition has not been met.
 * - Integer reply: `1` if the expiration time was set/updated.
 * - Integer reply: `2` when `HEXPIRE`/`HPEXPIRE` is called with 0 seconds/milliseconds or when `HEXPIREAT`/`HPEXPIREAT` is called with a past Unix time in seconds/milliseconds.
 * @see {@link https://redis.io/commands/hpexpireat}
 */
export function input(
	key: string,
	timestamp: number,
	fields: Collection<string | number>,
	options?: HpexpireatOptions,
): Command<number[]> {
	const args = ['HPEXPIREAT', key, String(timestamp)];

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
