import type { Command } from '../../types.js';

/**
 * Insert all the specified values at the tail of the list stored at key, only if key already exists and holds a list.
 * In contrary to RPUSH, no operation will be performed when key does not yet exist.
 *
 * - Available since: 2.2.0.
 * - Multiple elements are available since Redis 4.0.0.
 * - Time complexity: O(1) for each element added, so O(N) to add N elements when the command is called with multiple arguments.
 * @param key Key to push values to.
 * @param elements An array of elements to add to the list.
 * @returns The length of the list after the push operation.
 * @see {@link https://redis.io/commands/rpushx}
 */
declare function _command(key: string, elements: (string | number)[]): number;

/**
 * Insert all the specified values at the tail of the list stored at key, only if key already exists and holds a list.
 * In contrary to RPUSH, no operation will be performed when key does not yet exist.
 *
 * - Available since: 2.2.0.
 * - Multiple elements are available since Redis 4.0.0.
 * - Time complexity: O(1) for each element added, so O(N) to add N elements when the command is called with multiple arguments.
 * @param key Key to push values to.
 * @param elements Elements to add to the list.
 * @returns The length of the list after the push operation.
 * @see {@link https://redis.io/commands/rpushx}
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
		args: ['RPUSHX', key, ...elements.flat().map(String)],
	};
}
