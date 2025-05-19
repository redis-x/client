import type { Command } from '../../types.js';

export type SetOptions = {
	/**
	 * Only set the key if it does not already exist.
	 * - Incompatible with option `XX`.
	 * - Incompatible with option `GET` before 7.0.0.
	 * - Available since: 2.6.12.
	 */
	NX?: boolean,
	/**
	 * Only set the key if it already exist.
	 * - Incompatible with option `NX`.
	 * - Available since: 2.6.12.
	 */
	XX?: boolean,
	/**
	 * Set the specified expire time, in *seconds*.
	 * - Incompatible with options `PX`, `EXAT`, `PXAT` and `KEEPTTL`.
	 * - Available since: 2.6.12.
	 */
	EX?: number,
	/**
	 * Set the specified expire time, in *milliseconds*.
	 * - Incompatible with options `EX`, `EXAT`, `PXAT` and `KEEPTTL`.
	 * - Available since: 2.6.12.
	 */
	PX?: number,
	/**
	 * Set the specified expire time, in *seconds*.
	 * - Incompatible with options `EX`, `PX`, `PXAT` and `KEEPTTL`.
	 * - Available since: 6.2.0.
	 */
	EXAT?: number,
	/**
	 * Set the specified expire time, in *milliseconds*.
	 * - Incompatible with options `EX`, `PX`, `EXAT` and `KEEPTTL`.
	 * - Available since: 6.2.0.
	 */
	PXAT?: number,
	/**
	 * Retain the time to live associated with the key.
	 * - Incompatible with options `EX`, `PX`, `EXAT` and `PXAT`.
	 * - Available since: 6.0.0.
	 */
	KEEPTTL?: boolean,
	/**
	 * Get the value of the key before the SET operation.
	 * - Incompatible with option `NX` before 7.0.0.
	 * - Available since: 6.2.0.
	 */
	GET?: true,
};

/**
 * Set the string value of a key.
 * - Available since: 1.0.0.
 * - Time complexity: O(1).
 * @param key Key to set.
 * @param value Value to set.
 * @returns Returns string `"OK"` if the key was set, or `null` if operation was aborted (conflict with one of the XX/NX options).
 */
declare function _command(key: string, value: string | number): 'OK' | null;

/**
 * Set the string value of a key.
 * - Available since: 1.0.0.
 * - Time complexity: O(1).
 * @param key Key to set.
 * @param value Value to set.
 * @param options Comand options.
 * @returns Returns string `"OK"` if the key was set, or `null` if operation was aborted (conflict with one of the XX/NX options).
 */
declare function _command(key: string, value: string | number, options: Omit<SetOptions, 'GET'>): 'OK' | null;

/**
 * Set the string value of a key.
 * - Available since: 1.0.0.
 * - Time complexity: O(1).
 * @param key Key to set.
 * @param value Value to set.
 * @param options Comand options.
 * @returns Returns string with the previous value of the key, or `null` if the key didn't exist before the SET.
 */
declare function _command(key: string, value: string | number, options: SetOptions): string | null;

// eslint-disable-next-line jsdoc/require-jsdoc
export function input(key: string, value: string | number, options?: SetOptions): Command {
	const args_options: string[] = [];

	if (options) {
		if (options.NX) {
			args_options.push('NX');
		}

		if (options.XX) {
			args_options.push('XX');
		}

		if (options.EX) {
			args_options.push(
				'EX',
				String(options.EX),
			);
		}

		if (options.PX) {
			args_options.push(
				'PX',
				String(options.PX),
			);
		}

		if (options.EXAT) {
			args_options.push(
				'EXAT',
				String(options.EXAT),
			);
		}

		if (options.PXAT) {
			args_options.push(
				'PXAT',
				String(options.PXAT),
			);
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
		args: [
			'SET',
			key,
			String(value),
			...args_options,
		],
	};
}
