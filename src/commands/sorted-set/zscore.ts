import type { Command } from '../../types.js';

/**
 * Returns the score of member in the sorted set at key.
 * - Available since: 1.0.0.
 * - Time complexity: O(1).
 * @param key Key holds a sorted set.
 * @param member Member in the sorted set.
 * @returns The score of the member (a double-precision floating point number), represented as a string, or `null` if member does not exist in the sorted set, or the key does not exist.
 * @see {@link https://redis.io/commands/zscore}
 */
export function input(key: string, member: string | number): Command<number | null> {
	return {
		kind: '#schema',
		args: [
			'ZSCORE',
			key,
			String(member),
		],
		replyTransform(result: string | null) {
			return result ? Number.parseFloat(result) : null;
		},
	};
}
