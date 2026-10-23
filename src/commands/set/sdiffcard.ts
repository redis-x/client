import type { Command } from '../../types.js';
import { type Collection, collectionToStringArray } from '../../utils.js';

export type SdiffcardOptions = {
	/**
	 * Stop counting once the cardinality reaches `limit`. `0` (the default) means no limit.
	 * - Available since: 8.10.0.
	 */
	LIMIT?: number;
};

/**
 * Returns the cardinality of the difference between the first set and all the successive sets. This is the count-only counterpart of `SDIFF`: it returns just the number of elements in the difference, not the members themselves.
 *
 * Keys that do not exist are considered to be empty sets.
 * - Available since: 8.10.0.
 * - Time complexity: O(N) where N is the total number of elements in all given sets.
 * @param keys - One or more set keys. The result counts the members of the first set that are not present in any of the subsequent sets.
 * @param options -
 * @returns Integer reply: the number of elements in the resulting difference.
 * @see {@link https://redis.io/commands/sdiffcard}
 */
export function input(
	keys: Collection<string>,
	options?: SdiffcardOptions,
): Command<number> {
	const key_list = collectionToStringArray(keys);
	const args = ['SDIFFCARD', String(key_list.length), ...key_list];

	if (options?.LIMIT !== undefined) {
		args.push('LIMIT', String(options.LIMIT));
	}

	return {
		kind: '#schema',
		args,
	};
}
