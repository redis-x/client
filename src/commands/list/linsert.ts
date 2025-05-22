import type { Command } from '../../types.js';

/**
 * Inserts element in the list stored at key either before or after the reference value.
 *
 * - Available since: 2.2.0.
 * - Time complexity: O(N) where N is the number of elements to traverse before seeing the value pivot.
 *   This means that inserting somewhere on the left end on the list (head) can be considered O(1)
 *   and inserting somewhere on the right end (tail) is O(N).
 * @param key Key of the list.
 * @param element Element to insert.
 * @param options Command options.
 * @returns The length of the list after the insert operation, or 0 when the key doesn't exist, or -1 when the pivot wasn't found.
 * @see {@link https://redis.io/commands/linsert}
 */
export function input(
	key: string,
	element: string | number,
	options: {
		BEFORE: string | number,
	} | {
		AFTER: string | number,
	},
): Command<number> {
	return {
		kind: '#schema',
		args: [
			'LINSERT',
			key,
			...'BEFORE' in options
				? [ 'BEFORE', String(options.BEFORE) ]
				: [ 'AFTER', String(options.AFTER) ],
			String(element),
		],
	};
}
