import type { Command } from '../../types.js';

export type GetexOptions = {
	/**
	 * Set the specified expire time, in *seconds*.
	 * - Incompatible with options `PX`, `EXAT`, `PXAT` and `PERSIST`.
	 * - Available since: 6.2.0.
	 */
	EX?: number;
	/**
	 * Set the specified expire time, in *milliseconds*.
	 * - Incompatible with options `EX`, `EXAT`, `PXAT` and `PERSIST`.
	 * - Available since: 6.2.0.
	 */
	PX?: number;
	/**
	 * Set the specified Unix time at which the key will expire, in *seconds*.
	 * - Incompatible with options `EX`, `PX`, `PXAT` and `PERSIST`.
	 * - Available since: 6.2.0.
	 */
	EXAT?: number;
	/**
	 * Set the specified Unix time at which the key will expire, in *milliseconds*.
	 * - Incompatible with options `EX`, `PX`, `EXAT` and `PERSIST`.
	 * - Available since: 6.2.0.
	 */
	PXAT?: number;
	/**
	 * Remove the time to live associated with the key.
	 * - Incompatible with options `EX`, `PX`, `EXAT` and `PXAT`.
	 * - Available since: 6.2.0.
	 */
	PERSIST?: boolean;
};

/**
 * Get the value of key and optionally set its expiration.
 * GETEX is similar to GET, but is a write command with additional options.
 *
 * An error is returned if the value stored at key is not a string, because GETEX only handles string values.
 * - Available since: 6.2.0.
 * - Time complexity: O(1).
 * @param key Key to get.
 * @param options Command options.
 * @returns The value of key, or `null` when key does not exist.
 * @see {@link https://redis.io/commands/getex}
 */
export function input(
	key: string,
	options?: GetexOptions,
): Command<string | null> {
	const args_options: string[] = [];

	if (options) {
		if (options.EX !== undefined) {
			args_options.push('EX', String(options.EX));
		}

		if (options.PX !== undefined) {
			args_options.push('PX', String(options.PX));
		}

		if (options.EXAT !== undefined) {
			args_options.push('EXAT', String(options.EXAT));
		}

		if (options.PXAT !== undefined) {
			args_options.push('PXAT', String(options.PXAT));
		}

		if (options.PERSIST) {
			args_options.push('PERSIST');
		}
	}

	return {
		kind: '#schema',
		args: ['GETEX', key, ...args_options],
	};
}
