import type { Command } from '../../types.js';

/**
 * Inserts specified values at the head of the list stored at key, only if key already exists and holds a list.
 * In contrary to LPUSH, no operation will be performed when key does not yet exist.
 *
 * - Available since: 2.2.0.
 * - Time complexity: O(1) for each element added, so O(N) to add N elements when the command is called with multiple arguments.
 * @param key Key of the list.
 * @param elements Element or array of elements to push to the list.
 * @returns The length of the list after the push operation.
 * @see {@link https://redis.io/commands/lpushx}
 */
declare function _command(key: string, elements: (string | number)[]): number;

/**
 * Inserts specified values at the head of the list stored at key, only if key already exists and holds a list.
 * In contrary to LPUSH, no operation will be performed when key does not yet exist.
 *
 * - Available since: 2.2.0.
 * - Time complexity: O(1) for each element added, so O(N) to add N elements when the command is called with multiple arguments.
 * @param key Key of the list.
 * @param elements One or more elements to push to the list.
 * @returns The length of the list after the push operation.
 * @see {@link https://redis.io/commands/lpushx}
 */
declare function _command(key: string, ...elements: (string | number)[]): number;

// eslint-disable-next-line jsdoc/require-jsdoc
export function input(key: string, ...elements: (string | number | (string | number)[])[]): Command<number> {
	return {
		kind: '#schema',
		args: [
			'LPUSHX',
			key,
			...elements.flat().map(String),
		],
	};
}
