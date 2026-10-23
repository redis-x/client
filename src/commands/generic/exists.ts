import type { Command } from '../../types.js';
import { type Collection, collectionToStringArray } from '../../utils.js';

/**
 * Returns the number of keys that exist.
 *
 * If you specify the same existing key multiple times, EXISTS counts it each time. For example, if somekey exists, EXISTS somekey somekey returns 2.
 * - Available since: 1.0.0.
 * - Time complexity: O(N) where N is the number of keys to check.
 * @param keys Keys to check.
 * @returns The number of keys existing among the ones specified as arguments.
 * @see {@link https://redis.io/commands/exists}
 */
declare function _command(...keys: string[]): number;

/**
 * Returns the number of keys that exist.
 *
 * If you specify the same existing key multiple times, EXISTS counts it each time. For example, if somekey exists, EXISTS somekey somekey returns 2.
 * - Available since: 1.0.0.
 * - Time complexity: O(N) where N is the number of keys to check.
 * @param keys One or more keys to check for existence. A repeated key is counted once per occurrence.
 * @returns The number of keys existing among the ones specified as arguments.
 * @see {@link https://redis.io/commands/exists}
 */
declare function _command(keys: Collection<string>): number;

// eslint-disable-next-line jsdoc/require-jsdoc
export function input(
	arg0: string | Collection<string>,
	...args_rest: string[]
): Command<number> {
	const args = ['EXISTS'];

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
