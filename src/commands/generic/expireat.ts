import { replyTransform } from '../../reply-transformers/number-to-boolean.js';
import type { Command } from '../../types.js';

export type ExpireatOptions = {
	/**
	 * Set expiry only when the key has no expiry.
	 * - Incompatible with options `XX`, `GT` and `LT`.
	 * - Available since: 7.0.0.
	 * @type {boolean}
	 */
	NX?: boolean,
	/**
	 * Set expiry only when the key has an existing expiry.
	 * - Incompatible with options `NX`, `GT` and `LT`.
	 * - Available since: 7.0.0.
	 * @type {boolean}
	 */
	XX?: boolean,
	/**
	 * Set expiry only when the new expiry is greater than current one. A non-volatile key is treated as an infinite TTL.
	 * - Incompatible with options `NX`, `XX` and `LT`.
	 * - Available since: 7.0.0.
	 * @type {boolean}
	 */
	GT?: boolean,
	/**
	 * Set expiry only when the new expiry is less than current one. A non-volatile key is treated as an infinite TTL.
	 * - Incompatible with options `NX`, `XX` and `GT`.
	 * - Available since: 7.0.0.
	 * @type {boolean}
	 */
	LT?: boolean,
};

/**
 * This command has the same effect and semantic as EXPIRE, but instead of specifying the number of seconds representing the TTL (time to live), it takes an absolute Unix timestamp (seconds since January 1, 1970).
 *
 * A timestamp in the past will delete the key immediately.
 * - Available since: 1.2.0.
 * - Time complexity: O(1).
 * @param key Key to set the timeout on.
 * @param timestamp Unix timestamp in seconds.
 * @param options Command options.
 * @returns Returns `true` if the timeout was set. Returns `false` if the timeout was not set; for example, the key doesn't exist, or the operation was skipped because of the provided arguments.
 * @see {@link https://redis.io/commands/expireat}
 * @see {@link https://redis.io/commands/expire}
 */
export function input(key: string, timestamp: number, options?: ExpireatOptions): Command<boolean> {
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
		args: [
			'EXPIREAT',
			key,
			String(timestamp),
			...args_options,
		],
		replyTransform,
	};
}
