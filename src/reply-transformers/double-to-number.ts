/**
 * Converts a double reply, which RESP2 sends as a bulk string, to a number.
 * @param reply The double as a string, where `inf` and `-inf` mean infinite values.
 * @returns The number, including `Infinity` and `-Infinity`.
 */
export function doubleToNumber(reply: string): number {
	// Redis formats infinite doubles as "inf" and "-inf", which Number() cannot parse.
	switch (reply) {
		case 'inf':
			return Infinity;
		case '-inf':
			return -Infinity;
		default:
			return Number(reply);
	}
}
