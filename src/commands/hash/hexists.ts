import { replyTransform } from '../../reply-transformers/number-to-boolean.js';
import type { Command } from '../../types.js';

/**
 * Returns if field is an existing field in the hash stored at key.
 *
 * - Available since: 2.0.0.
 * - Time complexity: O(1).
 * @param key Key of the hash.
 * @param field Field to check in the hash.
 * @returns Returns `true` if the hash contains the field. Returns `false` if the hash does not contain the field, or the key does not exist.
 * @see {@link https://redis.io/commands/hexists}
 */
export function input(key: string, field: string | number): Command<boolean> {
	return {
		kind: '#schema',
		args: ['HEXISTS', key, String(field)],
		replyTransform,
	};
}
