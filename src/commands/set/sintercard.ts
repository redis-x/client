import type { Command } from '../../types.js';
import { type Collection, collectionToStringArray } from '../../utils.js';

export type SintercardOptions = {
	/**
	 * Stop counting once the cardinality reaches `limit`. `0` (the default) means no limit.
	 * - Available since: 7.0.0.
	 */
	LIMIT?: number;
};

/**
 * This command is similar to `SINTER`, but instead of returning the result set, it returns just the cardinality of the result.
 * Returns the cardinality of the set which would result from the intersection of all the given sets.
 *
 * Keys that do not exist are considered to be empty sets.
 * With one of the keys being an empty set, the resulting set is also empty (since set intersection with an empty set always results in an empty set).
 * - Available since: 7.0.0.
 * - Time complexity: O(N*M) worst case where N is the cardinality of the smallest set and M is the number of sets.
 * @param keys - One or more set keys to intersect.
 * @param options -
 * @returns Integer reply: the number of elements in the resulting intersection.
 * @see {@link https://redis.io/commands/sintercard}
 */
export function input(
	keys: Collection<string>,
	options?: SintercardOptions,
): Command<number> {
	const key_list = collectionToStringArray(keys);
	const args = ['SINTERCARD', String(key_list.length), ...key_list];

	if (options?.LIMIT !== undefined) {
		args.push('LIMIT', String(options.LIMIT));
	}

	return {
		kind: '#schema',
		args,
	};
}
