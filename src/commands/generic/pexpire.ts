import { replyTransform } from '../../reply-transformers/number-to-boolean.js';
import type { Command } from '../../types.js';

export type PexpireOptions = {
	/**
	 * Set expiry only when the key has no expiry.
	 * - Incompatible with options `XX`, `GT` and `LT`.
	 * - Available since: 7.0.0.
	 */
	NX?: boolean;
	/**
	 * Set expiry only when the key has an existing expiry.
	 * - Incompatible with options `NX`, `GT` and `LT`.
	 * - Available since: 7.0.0.
	 */
	XX?: boolean;
	/**
	 * Set expiry only when the new expiry is greater than current one. A non-volatile key is treated as an infinite TTL.
	 * - Incompatible with options `NX`, `XX` and `LT`.
	 * - Available since: 7.0.0.
	 */
	GT?: boolean;
	/**
	 * Set expiry only when the new expiry is less than current one. A non-volatile key is treated as an infinite TTL.
	 * - Incompatible with options `NX`, `XX` and `GT`.
	 * - Available since: 7.0.0.
	 */
	LT?: boolean;
};

/**
 * This command works exactly like EXPIRE but the time to live of the key is specified in milliseconds instead of seconds.
 * - Available since: 2.6.0.
 * - Time complexity: O(1).
 * @param key Key to set the timeout on.
 * @param seconds Time to live in milliseconds.
 * @param options Command options.
 * @returns Returns `true` if the timeout was set. Returns `false` if the timeout was not set; for example, the key doesn't exist, or the operation was skipped because of the provided arguments.
 * @see {@link https://redis.io/commands/pexpire}
 * @see {@link https://redis.io/commands/expire}
 */
export function input(
	key: string,
	seconds: number,
	options?: PexpireOptions,
): Command<boolean> {
	const args_options = [];

	if (options) {
		if (options.NX) {
			args_options.push('NX');
		}

		if (options.XX) {
			args_options.push('XX');
		}

		if (options.GT) {
			args_options.push('GT');
		}

		if (options.LT) {
			args_options.push('LT');
		}
	}

	return {
		kind: '#schema',
		args: ['PEXPIRE', key, String(seconds), ...args_options],
		replyTransform,
	};
}
