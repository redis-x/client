import type { Command } from '../../types.js';

/**
 * Remove the existing timeout on key, turning the key from volatile (a key with an expire set) to persistent (a key that will never expire as no timeout is associated).
 *
 * - Available since: 2.2.0.
 * - Time complexity: O(1).
 * @param key The key to persist.
 * @returns Returns `true` if the timeout was removed. Returns `false` if the key does not exist or does not have an associated timeout.
 * @see {@link https://redis.io/commands/persist}
 */
export function input(key: string): Command<boolean> {
	return {
		kind: '#schema',
		args: [
			'PERSIST',
			key,
		],
		replyTransform,
	};
}

// eslint-disable-next-line jsdoc/require-jsdoc
function replyTransform(reply: 0 | 1): boolean {
	return reply === 1;
}
