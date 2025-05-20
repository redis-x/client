import type { Command } from '../../types.js';

/**
 * Append a value to a key.
 *
 * If key already exists and is a string, this command appends the value at the end of the string.
 * If key does not exist it is created and set as an empty string, so APPEND will be similar to SET in this special case.
 * - Available since: 2.0.0.
 * - Time complexity: O(1). The amortized time complexity is O(1) assuming the appended value is small and the already present value is of any size, since the dynamic string library used by Redis will double the free space available on every reallocation.
 * @param key Key to append to.
 * @param value Value to append.
 * @returns The length of the string after the append operation.
 * @see {@link https://redis.io/commands/append}
 */
export function input(key: string, value: string): Command<number> {
	return {
		kind: '#schema',
		args: [
			'APPEND',
			key,
			value,
		],
	};
}
