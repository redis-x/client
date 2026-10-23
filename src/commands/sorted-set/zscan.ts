import { doubleToNumber } from '../../reply-transformers/double-to-number.js';
import type { Command } from '../../types.js';

export type ZscanOptions = {
	/**
	 * Only return members matching the given glob-style pattern.
	 * - Available since: 2.8.0.
	 */
	MATCH?: string;
	/**
	 * A hint for the number of members to return per iteration. The default is 10.
	 * - Available since: 2.8.0.
	 */
	COUNT?: number;
};

/**
 * Iterates over members and scores of a sorted set.
 *
 * `ZSCAN` is a cursor based iterator. This means that at every call of the command, the server returns an updated cursor that the user needs to use as the cursor argument in the next call.
 * An iteration starts when the cursor is set to 0, and terminates when the cursor returned by the server is 0.
 *
 * A given element may be returned multiple times. It is up to the application to handle the case of duplicated elements, for example only using the returned elements in order to perform operations that are safe when re-applied multiple times.
 * - Available since: 2.8.0.
 * - Time complexity: O(1) for every call. O(N) for a complete iteration, including enough command calls for the cursor to return back to 0. N is the number of elements inside the collection.
 * @param key - The name of the key that holds the sorted set.
 * @param cursor - The cursor value. Start an iteration with `0`, then use the cursor returned by each call as the argument to the next call.
 * @param options -
 * @returns Array reply: cursor and scan response in array form.
 * - The first element is a Bulk string reply that represents an unsigned 64-bit number, the cursor.
 * - The second element is an Array reply that contains two elements, a member and its associated score, for every returned element of the sorted set.
 * @see {@link https://redis.io/commands/zscan}
 */
export function input(
	key: string,
	cursor: string | number,
	options?: ZscanOptions,
): Command<{ cursor: string; members: Record<string, number> }> {
	const args = ['ZSCAN', key, String(cursor)];

	if (options?.MATCH !== undefined) {
		args.push('MATCH', options.MATCH);
	}

	if (options?.COUNT !== undefined) {
		args.push('COUNT', String(options.COUNT));
	}

	return {
		kind: '#schema',
		args,
		replyTransform(result: [string, string[]]) {
			const [next_cursor, reply] = result;
			const members: Record<string, number> = {};

			for (let index = 0; index < reply.length; index += 2) {
				// defineProperty keeps a member named "__proto__" as an own property.
				Object.defineProperty(members, reply[index]!, {
					value: doubleToNumber(reply[index + 1]!),
					writable: true,
					enumerable: true,
					configurable: true,
				});
			}

			return {
				cursor: next_cursor,
				members,
			};
		},
	};
}
