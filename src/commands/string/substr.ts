import type { Command } from '../../types.js';

/**
 * Returns the substring of the string value stored at key, determined by the offsets start and end (both are inclusive).
 * Negative offsets can be used in order to provide an offset starting from the end of the string.
 * So -1 means the last character, -2 the penultimate and so forth.
 * - Available since: 1.0.0.
 * - Time complexity: O(N) where N is the length of the returned string. The complexity is ultimately determined by the returned length, but because creating a substring from an existing string is very cheap, it can be considered O(1) for small strings.
 * @deprecated As of Redis version 2.0.0, this command is regarded as deprecated. It can be replaced by GETRANGE when migrating or writing new code.
 * @param key Key to get the substring from.
 * @param start Start offset (inclusive).
 * @param end End offset (inclusive).
 * @returns The substring of the string value stored at key.
 * @see {@link https://redis.io/commands/substr}
 */
export function input(key: string, start: number, end: number): Command<string> {
	return {
		kind: '#schema',
		args: [
			'SUBSTR',
			key,
			String(start),
			String(end),
		],
	};
}
