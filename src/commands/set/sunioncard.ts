import type { Command } from '../../types.js';
import { type Collection, collectionToStringArray } from '../../utils.js';

export type SunioncardOptions = {
	/**
	 * Return an approximate cardinality instead of an exact count.
	 * - Available since: 8.10.0.
	 */
	APPROX?: boolean;
	/**
	 * Stop counting once the cardinality reaches `limit`. `0` (the default) means no limit.
	 * - Available since: 8.10.0.
	 */
	LIMIT?: number;
};

/**
 * Returns the cardinality of the union of the given sets. This is the count-only counterpart of `SUNION`: it returns just the number of distinct elements in the union, not the members themselves.
 *
 * Keys that do not exist are considered to be empty sets.
 * - Available since: 8.10.0.
 * - Time complexity: O(N) where N is the total number of elements in all given sets.
 * @param keys - One or more set keys to union.
 * @param options -
 * @returns Integer reply: the number of elements in the resulting union.
 * @see {@link https://redis.io/commands/sunioncard}
 */
export function input(
	keys: Collection<string>,
	options?: SunioncardOptions,
): Command<number> {
	const key_list = collectionToStringArray(keys);
	const args = ['SUNIONCARD', String(key_list.length), ...key_list];

	if (options?.APPROX) {
		args.push('APPROX');
	}

	if (options?.LIMIT !== undefined) {
		args.push('LIMIT', String(options.LIMIT));
	}

	return {
		kind: '#schema',
		args,
	};
}
