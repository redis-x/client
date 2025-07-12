import type { Command } from '../../types.js';

/**
 * Insert all the specified values at the tail of the list stored at key.
 *
 * If key does not exist, it is created as empty list before performing the push operation.
 * When key holds a value that is not a list, an error is returned.
 * - Available since: 1.0.0.
 * - Multiple elements are available since Redis 2.4.0.
 * - Time complexity: O(1) for each element added, so O(N) to add N elements when the command is called with multiple arguments.
 * @param key Key to push values to.
 * @param elements An array of elements to add to the list.
 * @returns The length of the list after the push operation.
 * @see {@link https://redis.io/commands/rpush}
 */
declare function _command(key: string, elements: (string | number)[]): number;

/**
 * Insert all the specified values at the tail of the list stored at key.
 *
 * If key does not exist, it is created as empty list before performing the push operation.
 * When key holds a value that is not a list, an error is returned.
 * - Available since: 1.0.0.
 * - Multiple elements are available since Redis 2.4.0.
 * - Time complexity: O(1) for each element added, so O(N) to add N elements when the command is called with multiple arguments.
 * @param key Key to push values to.
 * @param elements Elements to add to the list.
 * @returns The length of the list after the push operation.
 * @see {@link https://redis.io/commands/rpush}
 */
declare function _command(
	key: string,
	...elements: (string | number)[]
): number;

// eslint-disable-next-line jsdoc/require-jsdoc
export function input(
	key: string,
	...elements: (string | number | (string | number)[])[]
): Command<number> {
	return {
		kind: '#schema',
		args: ['RPUSH', key, ...elements.flat().map(String)],
	};
}
