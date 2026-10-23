import type { Command } from '../../types.js';
import { type Collection, collectionToStringArray } from '../../utils.js';

/**
 * Removes the specified keys.
 *
 * A key is ignored if it does not exist.
 * - Available since: 1.0.0.
 * - Time complexity: O(N) where N is the number of keys that will be removed. When a key to remove holds a value other than a string, the individual complexity for this key is O(M) where M is the number of elements in the list, set, sorted set or hash.
 * @param keys Keys to delete.
 * @returns The number of keys that were removed.
 * @see {@link https://redis.io/commands/del}
 */
declare function _command(...keys: string[]): number;

/**
 * Removes the specified keys.
 *
 * A key is ignored if it does not exist.
 * - Available since: 1.0.0.
 * - Time complexity: O(N) where N is the number of keys that will be removed. When a key to remove holds a value other than a string, the individual complexity for this key is O(M) where M is the number of elements in the list, set, sorted set or hash.
 * @param keys One or more keys to delete.
 * @returns The number of keys that were removed.
 * @see {@link https://redis.io/commands/del}
 */
declare function _command(keys: Collection<string>): number;

// eslint-disable-next-line jsdoc/require-jsdoc
export function input(
	arg0: string | Collection<string>,
	...args_rest: string[]
): Command<number> {
	const args = ['DEL'];

	if (typeof arg0 === 'string') {
		args.push(arg0, ...args_rest);
	} else {
		args.push(...collectionToStringArray(arg0));
	}

	return {
		kind: '#schema',
		args,
	};
}
