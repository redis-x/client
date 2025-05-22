import { replyTransform } from '../../reply-transformers/number-to-boolean.js';
import type { Command } from '../../types.js';

/**
 * Sets field in the hash stored at key to value, only if field does not yet exist.
 * If key does not exist, a new key holding a hash is created.
 * If field already exists, this operation has no effect.
 *
 * - Available since: 2.0.0.
 * - Time complexity: O(1).
 * @param key The key of the hash.
 * @param field The field to set.
 * @param value The value to set.
 * @returns Returns `true` if the field is new and the value was set. Returns `false` if the field already exists and no operation was performed.
 * @see {@link https://redis.io/commands/hsetnx}
 */
export function input(key: string, field: string, value: string | number): Command<boolean> {
	return {
		kind: '#schema',
		args: [
			'HSETNX',
			key,
			field,
			String(value),
		],
		replyTransform,
	};
}
