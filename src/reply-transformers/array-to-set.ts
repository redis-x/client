/**
 * Converts an array of strings to a Set of strings.
 * @param reply The array of strings to convert.
 * @returns A Set containing the unique strings from the array.
 */
export function replyTransform(reply: string[]): Set<string> {
	return new Set(reply);
}
