import { arrayToSet } from '../../reply-transformers/array-to-set.js';
import type { Command } from '../../types.js';

export type ScanOptions = {
	/**
	 * Only return keys matching the given glob-style pattern.
	 * - Available since: 2.8.0.
	 */
	MATCH?: string;
	/**
	 * A hint for the number of keys to return per iteration. The default is 10.
	 * - Available since: 2.8.0.
	 */
	COUNT?: number;
	/**
	 * Only return keys of the given type, such as `string`, `list`, or `set`.
	 * - Available since: 6.0.0.
	 */
	TYPE?: string;
};

/**
 * Iterates over the key names in the database.
 *
 * `SCAN` is a cursor based iterator. This means that at every call of the command, the server returns an updated cursor that the user needs to use as the cursor argument in the next call.
 * An iteration starts when the cursor is set to 0, and terminates when the cursor returned by the server is 0.
 *
 * A given element may be returned multiple times. It is up to the application to handle the case of duplicated elements, for example only using the returned elements in order to perform operations that are safe when re-applied multiple times.
 * - Available since: 2.8.0.
 * - Time complexity: O(1) for every call. O(N) for a complete iteration, including enough command calls for the cursor to return back to 0. N is the number of elements inside the collection.
 * @param cursor - The cursor value. Start an iteration with `0`, then use the cursor returned by each call as the argument to the next call.
 * @param options -
 * @returns Array reply: specifically, an array with two elements.
 * - The first element is a Bulk string reply that represents an unsigned 64-bit number, the cursor.
 * - The second element is an Array reply with the names of scanned keys.
 * @see {@link https://redis.io/commands/scan}
 */
export function input(
	cursor: string | number,
	options?: ScanOptions,
): Command<{ cursor: string; keys: Set<string> }> {
	const args = ['SCAN', String(cursor)];

	if (options?.MATCH !== undefined) {
		args.push('MATCH', options.MATCH);
	}

	if (options?.COUNT !== undefined) {
		args.push('COUNT', String(options.COUNT));
	}

	if (options?.TYPE !== undefined) {
		args.push('TYPE', options.TYPE);
	}

	return {
		kind: '#schema',
		args,
		replyTransform(result: [string, string[]]) {
			return {
				cursor: result[0],
				keys: arrayToSet(result[1]),
			};
		},
	};
}
