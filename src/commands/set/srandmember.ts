import type { Command } from '../../types.js';

/**
 * When called with just the `key` argument, return a random element from the set value stored at `key`.
 * - Available since: 1.0.0.
 * - Time complexity: Without the count argument O(1), otherwise O(N) where N is the absolute value of the passed count.
 * @param key - The name of the key that holds the set.
 * @returns Bulk string reply: without the additional _count_ argument, the command returns a randomly selected member, or a Nil reply when _key_ doesn't exist.
 * @see {@link https://redis.io/commands/srandmember}
 */
declare function _command(key: string): string | null;

/**
 * If the provided `count` argument is positive, return an array of **distinct elements**.
 * The array's length is either `count` or the set's cardinality (`SCARD`), whichever is lower.
 *
 * If called with a negative `count`, the behavior changes and the command is allowed to return the **same element multiple times**.
 * In this case, the number of returned elements is the absolute value of the specified `count`.
 * - Available since: 1.0.0.
 * - Starting with Redis version 2.6.0: Added the optional `count` argument.
 * - Time complexity: Without the count argument O(1), otherwise O(N) where N is the absolute value of the passed count.
 * @param key - The name of the key that holds the set.
 * @param count - The number of members to return. A positive `count` returns up to that many distinct members; a negative `count` returns exactly `|count|` members and may repeat them.
 * @returns Array reply: when the optional _count_ argument is passed, the command returns an array of members, or an empty array when _key_ doesn't exist.
 * @see {@link https://redis.io/commands/srandmember}
 */
declare function _command(key: string, count: number): string[];

// eslint-disable-next-line jsdoc/require-jsdoc
export function input(key: string, count?: number): Command {
	const args = ['SRANDMEMBER', key];

	if (count !== undefined) {
		args.push(String(count));
	}

	return {
		kind: '#schema',
		args,
	};
}
