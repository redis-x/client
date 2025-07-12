import { replyTransform } from '../../reply-transformers/number-to-boolean.js';
import type { Command } from '../../types.js';

/**
 * Returns if member is a member of the set stored at key.
 *
 * - Available since: 1.0.0.
 * - Time complexity: O(1).
 * @param key The key of the set.
 * @param member The member to check.
 * @returns `true` if the member is a member of the set stored at key, `false` otherwise.
 * @see {@link https://redis.io/commands/sismember}
 */
export function input(key: string, member: string): Command<boolean> {
	return {
		kind: '#schema',
		args: ['SISMEMBER', key, member],
		replyTransform,
	};
}
