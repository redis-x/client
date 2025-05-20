import type { Command } from '../../types.js';

/**
 * Removes the specified members from the sorted set stored at key. Non existing members are ignored.
 * - Available since: 1.2.0
 * - Time complexity: O(M*log(N)) with N being the number of elements in the sorted set and M the number of elements to be removed.
 * @param key Key holds a sorted set.
 * @param members Members to remove.
 * @returns The number of members removed from the sorted set, not including non-existing members.
 * @see {@link https://redis.io/commands/zrem}
 */
declare function _command(
	key: string,
	...members: (string | number)[]
): number;

/**
 * Removes the specified members from the sorted set stored at key. Non existing members are ignored.
 * - Available since: 1.2.0
 * - Time complexity: O(M*log(N)) with N being the number of elements in the sorted set and M the number of elements to be removed.
 * @param key Key holds a sorted set.
 * @param members Members to remove.
 * @returns The number of members removed from the sorted set, not including non-existing members.
 * @see {@link https://redis.io/commands/zrem}
 */
declare function _command(
	key: string,
	members: (string | number)[] | Set<string> | IterableIterator<string>,
): number;

// eslint-disable-next-line jsdoc/require-jsdoc
export function input(
	key: string,
	arg1: string | number | (string | number)[] | Set<string> | IterableIterator<string>,
	...args_rest: (string | number)[]
): Command<number> {
	const args = [
		'ZREM',
		key,
	];

	if (typeof arg1 === 'string' || typeof arg1 === 'number') {
		args.push(
			String(arg1),
			...args_rest.map(String),
		);
	}
	else {
		args.push(
			...[ ...arg1 ].map(String),
		);
	}

	return {
		kind: '#schema',
		args,
	};
}
