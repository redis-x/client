/**
 * Converts a number to a boolean.
 * @param reply The number to convert (0 or 1).
 * @returns Returns true if the number is 1, false if it is 0.
 */
// eslint-disable-next-line unicorn/consistent-boolean-name
export function numberToBoolean(reply: 0 | 1): boolean {
	return reply === 1;
}
