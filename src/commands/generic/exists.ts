import type { Command } from '../../types.js';

/**
 * Returns the number of keys that exist from those specified as arguments.
 *
 * The user should be aware that if the same existing key is mentioned in the arguments multiple times, it will be counted multiple times. So if somekey exists, EXISTS somekey somekey will return 2.
 * - Available since: 1.0.0.
 * - Time complexity: O(N) where N is the number of keys to check.
 * @param keys Keys to check.
 * @returns The number of keys existing among the ones specified as arguments.
 */
export function input(...keys: string[]): Command<number> {
	return {
		kind: '#schema',
		args: [
			'EXISTS',
			...keys,
		],
	};
}
