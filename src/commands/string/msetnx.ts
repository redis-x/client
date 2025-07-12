import { replyTransform } from '../../reply-transformers/number-to-boolean.js';
import type { Command } from '../../types.js';

/**
 * Sets the given keys to their respective values. MSETNX will not perform
 * any operation at all even if just a single key already exists.
 *
 * - Available since: 1.0.1.
 * - Time complexity: O(N) where N is the number of keys to set.
 * @param pairs A record of key-value pairs.
 * @returns `true` if all the keys were set, `false` if no key was set (at least one key already existed).
 * @see {@link https://redis.io/commands/msetnx}
 */
export function input(
	pairs: Record<string, string | number>,
): Command<boolean> {
	const args: string[] = ['MSETNX'];
	for (const [key, value] of Object.entries(pairs)) {
		args.push(key, String(value));
	}

	return {
		kind: '#schema',
		args,
		replyTransform,
	};
}
