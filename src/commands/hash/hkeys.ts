import { replyTransform } from '../../reply-transformers/array-to-set.js';
import type { Command } from '../../types.js';

/**
 * Returns all field names in the hash stored at key.
 *
 * - Available since: 2.0.0.
 * - Time complexity: O(N) where N is the size of the hash.
 * @param key The key of the hash.
 * @returns A set of fields in the hash, or an empty set when the key does not exist.
 * @see {@link https://redis.io/commands/hkeys}
 */
export function input(key: string): Command<Set<string>> {
	return {
		kind: '#schema',
		args: ['HKEYS', key],
		replyTransform,
	};
}
