import { replyTransform } from '../../reply-transformers/array-to-set.js';
import type { Command } from '../../types.js';

/**
 * Returns all the members of the set value stored at key.
 *
 * - Available since: 1.0.0.
 * - Time complexity: O(N) where N is the set cardinality.
 * @param key The key of the set.
 * @returns A set with all the members of the set.
 * @see {@link https://redis.io/commands/smembers}
 */
export function input(key: string): Command<Set<string>> {
	return {
		kind: '#schema',
		args: [
			'SMEMBERS',
			key,
		],
		replyTransform,
	};
}
