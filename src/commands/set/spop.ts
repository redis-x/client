import { arrayToSet } from '../../reply-transformers/array-to-set.js';
import type { Command } from '../../types.js';

/**
 * Removes and returns one or more random members from the set value store at `key`.
 *
 * This operation is similar to `SRANDMEMBER`, that returns one or more random elements from a set but does not remove it.
 *
 * By default, the command pops a single member from the set.
 * - Available since: 1.0.0.
 * - Time complexity: Without the count argument O(1), otherwise O(N) where N is the value of the passed count.
 * @param key - The name of the key that holds the set.
 * @returns Any of the following:
 * - Nil reply: if the key does not exist.
 * - Bulk string reply: when called without the _count_ argument, the removed member.
 * @see {@link https://redis.io/commands/spop}
 */
declare function _command(key: string): string | null;

/**
 * Removes and returns one or more random members from the set value store at `key`.
 *
 * This operation is similar to `SRANDMEMBER`, that returns one or more random elements from a set but does not remove it.
 *
 * When provided with the optional `count` argument, the reply will consist of up to `count` members, depending on the set's cardinality.
 * - Available since: 1.0.0.
 * - Starting with Redis version 3.2.0: Added the optional `count` argument.
 * - Time complexity: Without the count argument O(1), otherwise O(N) where N is the value of the passed count.
 * @param key - The name of the key that holds the set.
 * @param count - The number of members to pop. Without it, a single member is popped.
 * @returns Array reply: when called with the _count_ argument, a list of the removed members.
 * @see {@link https://redis.io/commands/spop}
 */
declare function _command(key: string, count: number): Set<string>;

// eslint-disable-next-line jsdoc/require-jsdoc
export function input(key: string, count?: number): Command {
	if (count === undefined) {
		return {
			kind: '#schema',
			args: ['SPOP', key],
		};
	}

	return {
		kind: '#schema',
		args: ['SPOP', key, String(count)],
		replyTransform: arrayToSet,
	};
}
