import type { Command } from '../../types.js';

export type LinsertOptions = {
	/**
	 * Insert `element` before `pivot`, the existing element to insert relative to.
	 * - Incompatible with option `AFTER`.
	 * - Available since: 2.2.0.
	 */
	BEFORE?: string | number;
	/**
	 * Insert `element` after `pivot`, the existing element to insert relative to.
	 * - Incompatible with option `BEFORE`.
	 * - Available since: 2.2.0.
	 */
	AFTER?: string | number;
};

/**
 * Inserts `element` in the list stored at `key` either before or after the reference value `pivot`.
 *
 * When `key` does not exist, it is considered an empty list and no operation is performed.
 *
 * An error is returned when `key` exists but does not hold a list value.
 * - Available since: 2.2.0.
 * - Time complexity: O(N) where N is the number of elements to traverse before seeing the value pivot. This means that inserting somewhere on the left end on the list (head) can be considered O(1) and inserting somewhere on the right end (tail) is O(N).
 * @param key - The name of the key that holds the list.
 * @param element - The value to insert.
 * @param options -
 * @returns Any of the following:
 * - Integer reply: the list length after a successful insert operation.
 * - Integer reply: `0` when the key doesn't exist.
 * - Integer reply: `-1` when the pivot wasn't found.
 * @see {@link https://redis.io/commands/linsert}
 */
export function input(
	key: string,
	element: string | number,
	options: LinsertOptions,
): Command<number> {
	const args = ['LINSERT', key];

	if (options.BEFORE !== undefined) {
		args.push('BEFORE', String(options.BEFORE));
	}

	if (options.AFTER !== undefined) {
		args.push('AFTER', String(options.AFTER));
	}

	args.push(String(element));

	return {
		kind: '#schema',
		args,
	};
}
