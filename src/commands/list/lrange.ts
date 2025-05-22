import type { Command } from '../../types.js';

/**
 * Returns the specified elements of the list stored at key. The offsets start and stop
 * are zero-based indexes, with 0 being the first element of the list (the head of the list),
 * 1 being the next element and so on.
 *
 * These offsets can also be negative numbers indicating offsets starting at the end of the list.
 * For example, -1 is the last element of the list, -2 the penultimate, and so on.
 *
 * Out of range indexes will not produce an error. If start is larger than the end of the list,
 * an empty list is returned. If stop is larger than the actual end of the list, Redis will
 * treat it like the last element of the list.
 *
 * - Available since: 1.0.0.
 * - Time complexity: O(S+N) where S is the distance of start offset from HEAD for small lists,
 *   from nearest end (HEAD or TAIL) for large lists; and N is the number of elements in the specified range.
 * @param key The key of the list.
 * @param start The starting position (inclusive, 0-based index).
 * @param stop The ending position (inclusive, 0-based index).
 * @returns Array of elements in the specified range, or an empty array if the key doesn't exist.
 * @see {@link https://redis.io/commands/lrange}
 */
export function input(key: string, start: number, stop: number): Command<string[]> {
	return {
		kind: '#schema',
		args: [
			'LRANGE',
			key,
			String(start),
			String(stop),
		],
	};
}
