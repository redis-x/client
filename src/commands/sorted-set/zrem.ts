import type { Command } from '../../types.js';

/**
 * Removes the specified members from the sorted set stored at key. Non existing members are ignored.
 * - Available since: 1.2.0
 * - Time complexity: O(M*log(N)) with N being the number of elements in the sorted set and M the number of elements to be removed.
 * @param key Key holds a sorted set.
 * @param members Members to remove.
 * @returns The number of members removed from the sorted set, not including non-existing members.
 */
declare function _command(
	key: string,
	...members: string[]
): number;

/**
 * Removes the specified members from the sorted set stored at key. Non existing members are ignored.
 * - Available since: 1.2.0
 * - Time complexity: O(M*log(N)) with N being the number of elements in the sorted set and M the number of elements to be removed.
 * @param key Key holds a sorted set.
 * @param members Members to remove.
 * @returns The number of members removed from the sorted set, not including non-existing members.
 */
declare function _command(
	key: string,
	members: string[] | Set<string> | IterableIterator<string>,
): number;

// eslint-disable-next-line jsdoc/require-jsdoc
export function input(
	key: string,
	arg1: string | string[] | Set<string> | IterableIterator<string>,
	...args_rest: string[]
): Command<number> {
	const args = [
		'ZREM',
		key,
	];

	if (typeof arg1 === 'string') {
		args.push(arg1, ...args_rest);
	}
	else {
		args.push(...arg1);
	}

	return {
		kind: '#schema',
		args,
	};
}
