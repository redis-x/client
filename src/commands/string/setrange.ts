import type { Command } from '../../types.js';

/**
 * Overwrites part of the string stored at key, starting at the specified offset, for the entire length of value.
 * If the offset is larger than the current length of the string at key, the string is padded with zero-bytes to make offset fit.
 * Non-existing keys are considered as empty strings, so this command will make sure it holds a string large enough to be able to set value at offset.
 *
 * Note that the maximum offset that you can set is `2^29-1` (536870911), as Redis Strings are limited to 512 megabytes.
 *
 * - Available since: 2.2.0.
 * - Time complexity: O(1), not counting the time taken to copy the new string in place. Usually, this string is very small so the amortized complexity is O(1). Otherwise, complexity is O(M) with M being the length of the value argument.
 * @param key Key to modify.
 * @param offset Position at which the overwrite should begin.
 * @param value String that will be written to the key, starting at the specified offset.
 * @returns The length of the string after it was modified by the command.
 * @see {@link https://redis.io/commands/setrange}
 */
export function input(
	key: string,
	offset: number,
	value: string,
): Command<number> {
	return {
		kind: '#schema',
		args: ['SETRANGE', key, String(offset), value],
	};
}
