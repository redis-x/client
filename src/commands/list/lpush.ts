import type { Command } from '../../types.js';

/**
 * Insert all the specified elements at the head of the list stored at key.
 *
 * If key does not exist, it is created as empty list before performing the push operations.
 * - Available since: 1.0.0.
 * - Multiple field/value pairs are available since Redis 2.4.0.
 * - Time complexity: O(1) for each element added.
 * @param key Key of the list.
 * @param elements An array of elements to add to the list.
 * @returns The length of the list after the push operation.
 * @see {@link https://redis.io/commands/lpush}
 */
declare function _command(key: string, elements: (string | number)[]): number;

/**
 * Insert all the specified elements at the head of the list stored at key.
 *
 * If key does not exist, it is created as empty list before performing the push operations.
 * - Available since: 1.0.0.
 * - Multiple field/value pairs are available since Redis 2.4.0.
 * - Time complexity: O(1) for each element added.
 * @param key Key of the list.
 * @param elements Elements to add to the list.
 * @returns The length of the list after the push operation.
 * @see {@link https://redis.io/commands/lpush}
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
		args: ['LPUSH', key, ...elements.flat().map(String)],
	};
}
