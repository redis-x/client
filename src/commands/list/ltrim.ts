import type { Command } from '../../types.js';

/**
 * Trim an existing list so that it will contain only the specified range of elements specified.
 * Both `start` and `stop` are zero-based indexes, where 0 is the first element of the list (the head),
 * 1 the next element and so on.
 *
 * `start` and `stop` can also be negative numbers indicating offsets from the end of the list,
 * where -1 is the last element of the list, -2 the penultimate element and so on.
 *
 * Out of range indexes will not produce an error: if `start` is larger than the end of the list,
 * or `start` > `stop`, the result will be an empty list (which causes key to be removed).
 * If `stop` is larger than the end of the list, Redis will treat it like the last element of the list.
 *
 * - Available since: 1.0.0.
 * - Time complexity: O(N) where N is the number of elements to be removed by the operation.
 * @param key The key of the list to trim.
 * @param start Zero-based index of the first element to keep.
 * @param stop Zero-based index of the last element to keep.
 * @returns "OK"
 * @see {@link https://redis.io/commands/ltrim}
 */
export function input(key: string, start: number, stop: number): Command<'OK'> {
	return {
		kind: '#schema',
		args: ['LTRIM', key, String(start), String(stop)],
	};
}
