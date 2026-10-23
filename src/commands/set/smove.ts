import { numberToBoolean as replyTransform } from '../../reply-transformers/number-to-boolean.js';
import type { Command } from '../../types.js';

/**
 * Move `member` from the set at `source` to the set at `destination`.
 * This operation is atomic.
 * In every given moment the element will appear to be a member of `source` **or** `destination` for other clients.
 *
 * If the source set does not exist or does not contain the specified element, no operation is performed and `0` is returned.
 * Otherwise, the element is removed from the source set and added to the destination set.
 * When the specified element already exists in the destination set, it is only removed from the source set.
 * - Available since: 1.0.0.
 * - Time complexity: O(1).
 * @param source - The key of the source set.
 * @param destination - The key of the destination set.
 * @param member - The member to move from the source set to the destination set.
 * @returns Any of the following:
 * - Integer reply: `1` if the element is moved.
 * - Integer reply: `0` if the element is not a member of _source_ and no operation was performed.
 * @see {@link https://redis.io/commands/smove}
 */
export function input(
	source: string,
	destination: string,
	member: string | number,
): Command<boolean> {
	return {
		kind: '#schema',
		args: ['SMOVE', source, destination, String(member)],
		replyTransform,
	};
}
