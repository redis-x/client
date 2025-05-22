import type { Command } from '../../types.js';

/**
 * Removes the first count occurrences of elements equal to element from the list stored at key.
 * The count argument influences the operation in the following ways:
 * - count > 0: Remove elements equal to element moving from head to tail.
 * - count < 0: Remove elements equal to element moving from tail to head.
 * - count = 0: Remove all elements equal to element.
 *
 * - Available since: 1.0.0.
 * - Time complexity: O(N+M) where N is the length of the list and M is the number of elements removed.
 * @param key The key of the list.
 * @param count The number of occurrences to remove. Use negative values to start from the tail.
 * @param element The element to remove from the list.
 * @returns The number of removed elements.
 * @see {@link https://redis.io/commands/lrem}
 */
export function input(key: string, count: number, element: string | number): Command<number> {
	return {
		kind: '#schema',
		args: [
			'LREM',
			key,
			String(count),
			String(element),
		],
	};
}
