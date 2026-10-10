import type { Command } from '../../types.js';

export type SetOptions = {
	/**
	 * Only set the key if it does not already exist.
	 * The condition options (`NX`, `XX`, `IFEQ`, `IFNE`, `IFDEQ`, `IFDNE`) are mutually exclusive.
	 * - Incompatible with option `GET` before 7.0.0.
	 * - Available since: 2.6.12.
	 */
	NX?: boolean;
	/**
	 * Only set the key if it already exists.
	 * The condition options (`NX`, `XX`, `IFEQ`, `IFNE`, `IFDEQ`, `IFDNE`) are mutually exclusive.
	 * - Available since: 2.6.12.
	 */
	XX?: boolean;
	/**
	 * Set the key's value and expiration only if its current value is equal to `ifeq-value`.
	 * If the key doesn't exist, it won't be created.
	 * The condition options (`NX`, `XX`, `IFEQ`, `IFNE`, `IFDEQ`, `IFDNE`) are mutually exclusive.
	 * - Available since: 8.4.0.
	 */
	IFEQ?: string | number;
	/**
	 * Set the key's value and expiration only if its current value is not equal to `ifne-value`.
	 * If the key doesn't exist, it will be created.
	 * The condition options (`NX`, `XX`, `IFEQ`, `IFNE`, `IFDEQ`, `IFDNE`) are mutually exclusive.
	 * - Available since: 8.4.0.
	 */
	IFNE?: string | number;
	/**
	 * Set the key's value and expiration only if the hash digest of its current value is equal to `ifdeq-digest`.
	 * If the key doesn't exist, it won't be created.
	 * The condition options (`NX`, `XX`, `IFEQ`, `IFNE`, `IFDEQ`, `IFDNE`) are mutually exclusive.
	 * - Available since: 8.4.0.
	 * @see {@link https://redis.io/docs/latest/commands/set/#hash-digest}
	 */
	IFDEQ?: string;
	/**
	 * Set the key's value and expiration only if the hash digest of its current value is not equal to `ifdne-digest`.
	 * If the key doesn't exist, it will be created.
	 * The condition options (`NX`, `XX`, `IFEQ`, `IFNE`, `IFDEQ`, `IFDNE`) are mutually exclusive.
	 * - Available since: 8.4.0.
	 * @see {@link https://redis.io/docs/latest/commands/set/#hash-digest}
	 */
	IFDNE?: string;
	/**
	 * Set the specified expire time, in *seconds*.
	 * - Incompatible with options `PX`, `EXAT`, `PXAT` and `KEEPTTL`.
	 * - Available since: 2.6.12.
	 */
	EX?: number;
	/**
	 * Set the specified expire time, in *milliseconds*.
	 * - Incompatible with options `EX`, `EXAT`, `PXAT` and `KEEPTTL`.
	 * - Available since: 2.6.12.
	 */
	PX?: number;
	/**
	 * Set the specified expire time, in *seconds*.
	 * - Incompatible with options `EX`, `PX`, `PXAT` and `KEEPTTL`.
	 * - Available since: 6.2.0.
	 */
	EXAT?: number;
	/**
	 * Set the specified expire time, in *milliseconds*.
	 * - Incompatible with options `EX`, `PX`, `EXAT` and `KEEPTTL`.
	 * - Available since: 6.2.0.
	 */
	PXAT?: number;
	/**
	 * Retain the time to live associated with the key.
	 * - Incompatible with options `EX`, `PX`, `EXAT` and `PXAT`.
	 * - Available since: 6.0.0.
	 */
	KEEPTTL?: boolean;
	/**
	 * Return the old string stored at the key, or nil if the key did not exist.
	 * An error is returned and `SET` is aborted if the value stored at the key is not a string.
	 * - Incompatible with option `NX` before 7.0.0.
	 * - Available since: 6.2.0.
	 */
	GET?: boolean;
};

/**
 * Set `key` to hold the string `value`.
 * - Available since: 1.0.0.
 * - Time complexity: O(1).
 * @param key The name of the key.
 * @param value The string value to set.
 * @param options Command options.
 * @returns
 * - Simple string reply: `OK`: The key was set.
 * - Null bulk string reply in the following two cases.
 *   - The key doesn’t exist and `XX/IFEQ/IFDEQ` was specified. The key was not created.
 *   - The key exists, and `NX` was specified or a specified `IFEQ/IFNE/IFDEQ/IFDNE` condition is false. The key was not set.
 * @see {@link https://redis.io/commands/set}
 */
declare function _command(
	key: string,
	value: string | number,
	options?: SetOptions & { GET?: false },
): 'OK' | null;

/**
 * Set `key` to hold the string `value`.
 * - Available since: 1.0.0.
 * - Time complexity: O(1).
 * @param key The name of the key.
 * @param value The string value to set.
 * @param options Command options.
 * @returns
 * - Null bulk string reply: The key didn't exist before the `SET` operation, whether the key was created of not.
 * - Bulk string reply: The previous value of the key, whether the key was set or not.
 * @see {@link https://redis.io/commands/set}
 */
declare function _command(
	key: string,
	value: string | number,
	options: SetOptions & { GET: true },
): string | null;

/**
 * Set `key` to hold the string `value`.
 * - Available since: 1.0.0.
 * - Time complexity: O(1).
 * @param key The name of the key.
 * @param value The string value to set.
 * @param options Command options.
 * @returns
 * - If `GET` was not specified, one of the following:
 *   - Simple string reply: `OK`: The key was set.
 *   - Null bulk string reply in the following two cases.
 *     - The key doesn’t exist and `XX/IFEQ/IFDEQ` was specified. The key was not created.
 *     - The key exists, and `NX` was specified or a specified `IFEQ/IFNE/IFDEQ/IFDNE` condition is false. The key was not set.
 * - If `GET` was specified, one of the following:
 *   - Null bulk string reply: The key didn't exist before the `SET` operation, whether the key was created of not.
 *   - Bulk string reply: The previous value of the key, whether the key was set or not.
 * @see {@link https://redis.io/commands/set}
 */
declare function _command(
	key: string,
	value: string | number,
	options?: SetOptions,
): string | null;

// eslint-disable-next-line jsdoc/require-jsdoc
export function input(
	key: string,
	value: string | number,
	options?: SetOptions,
): Command {
	const args_options: string[] = [];

	if (options) {
		if (options.NX) {
			args_options.push('NX');
		}

		if (options.XX) {
			args_options.push('XX');
		}

		if (options.IFEQ !== undefined) {
			args_options.push('IFEQ', String(options.IFEQ));
		}

		if (options.IFNE !== undefined) {
			args_options.push('IFNE', String(options.IFNE));
		}

		if (options.IFDEQ !== undefined) {
			args_options.push('IFDEQ', options.IFDEQ);
		}

		if (options.IFDNE !== undefined) {
			args_options.push('IFDNE', options.IFDNE);
		}

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

		if (options.KEEPTTL) {
			args_options.push('KEEPTTL');
		}

		if (options.GET) {
			args_options.push('GET');
		}
	}

	return {
		kind: '#schema',
		args: ['SET', key, String(value), ...args_options],
	};
}
