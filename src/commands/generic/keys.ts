import type { Command } from '../../types.js';

/**
 * Returns all keys matching pattern.
 * - Available since: 1.0.0.
 * - Time complexity: O(N) with N being the number of keys in the database.
 * @param pattern Pattern to match.
 * @returns A set of keys matching pattern.
 */
export function input(pattern: string): Command<Set<string>> {
	return {
		kind: '#schema',
		args: [
			'KEYS',
			pattern,
		],
		replyTransform,
	};
}

// eslint-disable-next-line jsdoc/require-jsdoc
function replyTransform(result: string[]): Set<string> {
	return new Set(result);
}
