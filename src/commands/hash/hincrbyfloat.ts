import type { Command } from '../../types.js';

/**
 * Increment the specified field of a hash stored at key, and representing a floating point number, by the specified increment.
 * If the increment value is negative, the result is to have the hash field value decremented instead of incremented.
 * If the field does not exist, it is set to 0 before performing the operation.
 *
 * - Available since: 2.6.0.
 * - Time complexity: O(1).
 * @param key Key of the hash.
 * @param field Field in the hash to increment.
 * @param increment The increment value (can be negative for decrementing).
 * @returns The value of the field after the increment operation as a string representing the floating point value.
 * @see {@link https://redis.io/commands/hincrbyfloat}
 */
export function input(
	key: string,
	field: string | number,
	increment: number,
): Command<string> {
	return {
		kind: '#schema',
		args: ['HINCRBYFLOAT', key, String(field), String(increment)],
	};
}
