import type { Command } from '../../types.js';

/**
 * Returns the substring of the string value stored at key, determined by the offsets start and end (both are inclusive).
 * Negative offsets can be used in order to provide an offset starting from the end of the string.
 * So -1 means the last character, -2 the penultimate and so forth.
 *
 * The function handles out of range requests by limiting the resulting range to the actual length of the string.
 * - Available since: 2.4.0.
 * - Time complexity: O(N) where N is the length of the returned string. The complexity is ultimately determined by the returned length, but because creating a substring from an existing string is very cheap, it can be considered O(1) for small strings.
 * @param key The key holding the string value.
 * @param start The starting offset. Can be negative to count from the end of the string.
 * @param end The ending offset (inclusive). Can be negative to count from the end of the string.
 * @returns The substring.
 * @see {@link https://redis.io/commands/getrange}
 */
export function input(
	key: string,
	start: number,
	end: number,
): Command<string> {
	return {
		kind: '#schema',
		args: ['GETRANGE', key, String(start), String(end)],
	};
}
