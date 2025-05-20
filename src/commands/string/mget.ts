import type { Command } from '../../types.js';

/**
 * Returns the values of all specified keys. For every key that does not hold a
 * string value or does not exist, the special value `null` is returned.
 * Because of this, the operation never fails.
 *
 * - Available since: 1.0.0.
 * - Time complexity: O(N) where N is the number of keys to retrieve.
 * @param keys The keys to get.
 * @returns Array reply: a list of values at the specified keys.
 * @see {@link https://redis.io/commands/mget}
 */
declare function _command<const K extends string[]>(keys: K): { [I in keyof K]: string | null };

/**
 * Returns the values of all specified keys. For every key that does not hold a
 * string value or does not exist, the special value `null` is returned.
 * Because of this, the operation never fails.
 *
 * - Available since: 1.0.0.
 * - Time complexity: O(N) where N is the number of keys to retrieve.
 * @param keys The keys to get.
 * @returns Array reply: a list of values at the specified keys.
 * @see {@link https://redis.io/commands/mget}
 */
declare function _command<const K extends string[]>(...keys: K): { [I in keyof K]: string | null };

// eslint-disable-next-line jsdoc/require-jsdoc
export function input(...args: (string | string[])[]): Command<(string | null)[]> {
	return {
		kind: '#schema',
		args: [
			'MGET',
			...args.flat(),
		],
	};
}
