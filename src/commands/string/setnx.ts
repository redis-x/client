import { replyTransform } from '../../reply-transformers/number-to-boolean.js';
import type { Command } from '../../types.js';

/**
 * Set key to hold string value if key does not exist. In that case, it is equal to SET.
 * When key already holds a value, no operation is performed. SETNX is short for "SET if Not eXists".
 *
 * - Available since: 1.0.0.
 * - Time complexity: O(1).
 * @deprecated As of Redis version 2.6.12, this command is regarded as deprecated. It can be replaced by SET with the NX argument when migrating or writing new code.
 * @param key Key to set.
 * @param value Value to set.
 * @returns Integer reply: 1 if the key was set, 0 if the key was not set.
 * @see {@link https://redis.io/commands/setnx}
 */
export function input(key: string, value: string | number): Command<boolean> {
	return {
		kind: '#schema',
		args: ['SETNX', key, String(value)],
		replyTransform,
	};
}
