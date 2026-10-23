import { arrayToSet } from '../../reply-transformers/array-to-set.js';
import type { Command } from '../../types.js';
import { stringBulkToObject } from '../../utils.js';

export type HscanOptions = {
	/**
	 * Only return fields whose names match the given glob-style pattern.
	 * - Available since: 2.8.0.
	 */
	MATCH?: string;
	/**
	 * A hint for the number of fields to return per iteration. The default is 10.
	 * - Available since: 2.8.0.
	 */
	COUNT?: number;
	/**
	 * Return only the field names, without their values.
	 * - Available since: 7.4.0.
	 */
	NOVALUES?: boolean;
};

/**
 * Iterates over fields and values of a hash.
 *
 * `HSCAN` is a cursor based iterator. This means that at every call of the command, the server returns an updated cursor that the user needs to use as the cursor argument in the next call.
 * An iteration starts when the cursor is set to 0, and terminates when the cursor returned by the server is 0.
 *
 * A given element may be returned multiple times. It is up to the application to handle the case of duplicated elements, for example only using the returned elements in order to perform operations that are safe when re-applied multiple times.
 * - Available since: 2.8.0.
 * - Time complexity: O(1) for every call. O(N) for a complete iteration, including enough command calls for the cursor to return back to 0. N is the number of elements inside the collection.
 * @param key - The name of the key that holds the hash.
 * @param cursor - The cursor value. Start an iteration with `0`, then use the cursor returned by each call as the argument to the next call.
 * @param options -
 * @returns Array reply: a two-element array.
 * - The first element is a Bulk string reply that represents an unsigned 64-bit number, the cursor.
 * - The second element is an Array reply of field/value pairs that were scanned.
 * @see {@link https://redis.io/commands/hscan}
 */
declare function _command(
	key: string,
	cursor: string | number,
	options?: HscanOptions & { NOVALUES?: false },
): { cursor: string; fields: Record<string, string> };

/**
 * Iterates over fields and values of a hash.
 *
 * `HSCAN` is a cursor based iterator. This means that at every call of the command, the server returns an updated cursor that the user needs to use as the cursor argument in the next call.
 * An iteration starts when the cursor is set to 0, and terminates when the cursor returned by the server is 0.
 *
 * A given element may be returned multiple times. It is up to the application to handle the case of duplicated elements, for example only using the returned elements in order to perform operations that are safe when re-applied multiple times.
 * - Available since: 2.8.0.
 * - Time complexity: O(1) for every call. O(N) for a complete iteration, including enough command calls for the cursor to return back to 0. N is the number of elements inside the collection.
 * @param key - The name of the key that holds the hash.
 * @param cursor - The cursor value. Start an iteration with `0`, then use the cursor returned by each call as the argument to the next call.
 * @param options -
 * @returns Array reply: a two-element array.
 * - The first element is a Bulk string reply that represents an unsigned 64-bit number, the cursor.
 * - The second element is an Array reply: when the `NOVALUES` flag is used, only the field names are returned.
 * @see {@link https://redis.io/commands/hscan}
 */
declare function _command(
	key: string,
	cursor: string | number,
	options: HscanOptions & { NOVALUES: true },
): { cursor: string; fields: Set<string> };

/**
 * Iterates over fields and values of a hash.
 *
 * `HSCAN` is a cursor based iterator. This means that at every call of the command, the server returns an updated cursor that the user needs to use as the cursor argument in the next call.
 * An iteration starts when the cursor is set to 0, and terminates when the cursor returned by the server is 0.
 *
 * A given element may be returned multiple times. It is up to the application to handle the case of duplicated elements, for example only using the returned elements in order to perform operations that are safe when re-applied multiple times.
 * - Available since: 2.8.0.
 * - Time complexity: O(1) for every call. O(N) for a complete iteration, including enough command calls for the cursor to return back to 0. N is the number of elements inside the collection.
 * @param key - The name of the key that holds the hash.
 * @param cursor - The cursor value. Start an iteration with `0`, then use the cursor returned by each call as the argument to the next call.
 * @param options -
 * @returns Array reply: a two-element array.
 * - The first element is a Bulk string reply that represents an unsigned 64-bit number, the cursor.
 * - The second element is an Array reply of field/value pairs that were scanned. When the `NOVALUES` flag is used, only the field names are returned.
 * @see {@link https://redis.io/commands/hscan}
 */
declare function _command(
	key: string,
	cursor: string | number,
	options?: HscanOptions,
): { cursor: string; fields: Record<string, string> | Set<string> };

// eslint-disable-next-line jsdoc/require-jsdoc
export function input(
	key: string,
	cursor: string | number,
	options?: HscanOptions,
): Command {
	const args = ['HSCAN', key, String(cursor)];
	const has_novalues = options?.NOVALUES === true;

	if (options?.MATCH !== undefined) {
		args.push('MATCH', options.MATCH);
	}

	if (options?.COUNT !== undefined) {
		args.push('COUNT', String(options.COUNT));
	}

	if (has_novalues) {
		args.push('NOVALUES');
	}

	return {
		kind: '#schema',
		args,
		replyTransform(result: [string, string[]]) {
			return {
				cursor: result[0],
				fields: has_novalues
					? arrayToSet(result[1])
					: stringBulkToObject(result[1]),
			};
		},
	};
}
