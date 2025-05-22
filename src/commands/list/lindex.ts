import type { Command } from '../../types.js';

/**
 * Returns the element at index in the list stored at key.
 * The index is zero-based, so 0 means the first element, 1 the second element and so on.
 * Negative indices can be used to designate elements starting at the tail of the list.
 *
 * - Available since: 1.0.0.
 * - Time complexity: O(N) where N is the number of elements to traverse to get to the element at index. This makes asking for the first or the last element of the list O(1).
 * @param key Key of the list.
 * @param index Zero-based index of the element to return.
 * @returns The requested element, or `null` when index is out of range.
 * @see {@link https://redis.io/commands/lindex}
 */
export function input(key: string, index: number): Command<string | null> {
	return {
		kind: '#schema',
		args: [
			'LINDEX',
			key,
			String(index),
		],
	};
}
