import type { Command } from '../../types.js';

export type HrandfieldOptions = {
	/**
	 * Also return the value of each selected field. Can only be used together with `count`.
	 * - Available since: 6.2.0.
	 */
	WITHVALUES?: boolean;
};

/**
 * When called with just the `key` argument, return a random field from the hash value stored at `key`.
 * - Available since: 6.2.0.
 * - Time complexity: O(N) where N is the number of fields returned.
 * @param key - The name of the key that holds the hash.
 * @returns Any of the following:
 * - Nil reply: if the key doesn't exist
 * - Bulk string reply: a single, randomly selected field when the `count` option is not used
 * @see {@link https://redis.io/commands/hrandfield}
 */
declare function _command(key: string): string | null;

/**
 * If the provided `count` argument is positive, return an array of **distinct fields**.
 * The array's length is either `count` or the hash's number of fields (`HLEN`), whichever is lower.
 *
 * If called with a negative `count`, the behavior changes and the command is allowed to return the **same field multiple times**.
 * In this case, the number of returned fields is the absolute value of the specified `count`.
 * - Available since: 6.2.0.
 * - Time complexity: O(N) where N is the number of fields returned.
 * @param key - The name of the key that holds the hash.
 * @param count - The number of fields to return. A positive `count` returns up to that many distinct fields; a negative `count` returns exactly `|count|` fields and may repeat fields.
 * @param options -
 * @returns Array reply: a list containing `count` fields when the `count` option is used, or an empty array if the key does not exists.
 * @see {@link https://redis.io/commands/hrandfield}
 */
declare function _command(
	key: string,
	count: number,
	options?: HrandfieldOptions & { WITHVALUES?: false },
): string[];

/**
 * If the provided `count` argument is positive, return an array of **distinct fields**.
 * The array's length is either `count` or the hash's number of fields (`HLEN`), whichever is lower.
 *
 * If called with a negative `count`, the behavior changes and the command is allowed to return the **same field multiple times**.
 * In this case, the number of returned fields is the absolute value of the specified `count`.
 *
 * The optional `WITHVALUES` modifier changes the reply so it includes the respective values of the randomly selected hash fields.
 * - Available since: 6.2.0.
 * - Time complexity: O(N) where N is the number of fields returned.
 * @param key - The name of the key that holds the hash.
 * @param count - The number of fields to return. A positive `count` returns up to that many distinct fields; a negative `count` returns exactly `|count|` fields and may repeat fields.
 * @param options -
 * @returns Array reply: a list of fields and their values when `count` and `WITHVALUES` were both used.
 * @see {@link https://redis.io/commands/hrandfield}
 */
declare function _command(
	key: string,
	count: number,
	options: HrandfieldOptions & { WITHVALUES: true },
): {
	field: string;
	value: string;
}[];

/**
 * If the provided `count` argument is positive, return an array of **distinct fields**.
 * The array's length is either `count` or the hash's number of fields (`HLEN`), whichever is lower.
 *
 * If called with a negative `count`, the behavior changes and the command is allowed to return the **same field multiple times**.
 * In this case, the number of returned fields is the absolute value of the specified `count`.
 *
 * The optional `WITHVALUES` modifier changes the reply so it includes the respective values of the randomly selected hash fields.
 * - Available since: 6.2.0.
 * - Time complexity: O(N) where N is the number of fields returned.
 * @param key - The name of the key that holds the hash.
 * @param count - The number of fields to return. A positive `count` returns up to that many distinct fields; a negative `count` returns exactly `|count|` fields and may repeat fields.
 * @param options -
 * @returns Any of the following:
 * - Array reply: a list containing `count` fields when the `count` option is used, or an empty array if the key does not exists.
 * - Array reply: a list of fields and their values when `count` and `WITHVALUES` were both used.
 * @see {@link https://redis.io/commands/hrandfield}
 */
declare function _command(
	key: string,
	count: number,
	options?: HrandfieldOptions,
): string[] | { field: string; value: string }[];

// eslint-disable-next-line jsdoc/require-jsdoc
export function input(
	key: string,
	count?: number,
	options?: HrandfieldOptions,
): Command {
	const args = ['HRANDFIELD', key];
	const has_withvalues = count !== undefined && options?.WITHVALUES === true;

	if (count !== undefined) {
		args.push(String(count));
	}

	if (has_withvalues) {
		args.push('WITHVALUES');
	}

	return {
		kind: '#schema',
		args,
		replyTransform(result: string | string[] | null) {
			if (has_withvalues) {
				const reply = result as string[];
				const transformed_result = [];

				for (let index = 0; index < reply.length; index += 2) {
					transformed_result.push({
						field: reply[index],
						value: reply[index + 1],
					});
				}

				return transformed_result;
			}

			return result;
		},
	};
}
