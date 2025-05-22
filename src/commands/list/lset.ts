import type { Command } from '../../types.js';

/**
 * Sets the list element at index to element. For more information on the index argument, see LINDEX.
 *
 * An error is returned for out of range indexes.
 *
 * - Available since: 1.0.0.
 * - Time complexity: O(N) where N is the length of the list. Setting either the first or the last element of the list is O(1).
 * @param key The key of the list.
 * @param index The index of the element to set. Can be negative to count from the end of the list.
 * @param element The new value to set.
 * @returns "OK" if successful.
 * @see {@link https://redis.io/commands/lset}
 */
export function input(key: string, index: number, element: string | number): Command<'OK'> {
	return {
		kind: '#schema',
		args: [
			'LSET',
			key,
			String(index),
			String(element),
		],
	};
}
