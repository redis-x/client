import type { Command } from '../../types.js';

export type XaddId = '*' | (string & {});
export type XaddPairs = Record<string, string | number | undefined>;

export type XaddOptions = {
	/**
	 * Prevents the creation of a new stream if the key does not exist.
	 * - Available since: 6.2.0.
	 */
	NOMKSTREAM?: boolean;
	/**
	 * Trims the stream to maintain a specific size or remove old entries.
	 * - Available since: 5.0.0.
	 */
	trim?: {
		/**
		 * When specified, limits the stream to the specified threshold.
		 * With MAXLEN, the stream is limited by the number of entries.
		 * With MINID, the stream is limited by the minimum ID.
		 * - Available since: 5.0.0 for MAXLEN, 6.2.0 for MINID.
		 */
		strategy: 'MAXLEN' | 'MINID';
		/**
		 * Exact trimming or almost exact trimming.
		 * When `~` is specified, the trimming will be performed in a more efficient way, but may
		 * leave a few more items than the specified threshold.
		 * When `=` is specified (or when not specified at all), the trimming will be exact.
		 * - Available since: 5.0.0.
		 */
		operator?: '~' | '=';
		/**
		 * The threshold used for trimming. With MAXLEN, it represents the maximum number of
		 * entries. With MINID, it represents the minimum ID.
		 * - Available since: 5.0.0.
		 */
		threshold: string | number;
		/**
		 * Limits the number of entries to examine during trimming.
		 * When not specified, Redis uses a default value of 100 * the number of entries in a macro node.
		 * Specifying 0 disables the limiting mechanism entirely.
		 * - Available since: 6.2.0.
		 */
		LIMIT?: number;
	};
};

/**
 * Appends the specified stream entry to the stream at the specified `key`.
 * If the key does not exist, `XADD` will create a new key with the given stream value as a side effect of running this command.
 * You can turn off key creation with the `NOMKSTREAM` option.
 * - Available since: 5.0.0.
 * - Time complexity: O(1) when adding a new entry, O(N) when trimming where N being the number of entries evicted.
 * @param key The name of the stream key.
 * @param id The stream entry ID. Use `*` to auto-generate a unique ID, or specify a well-formed ID in the format `<ms>-<seq>` (for example, `1526919030474-55`).
 * @param pairs One or more field-value pairs that make up the stream entry. You must provide at least one field-value pair.
 * @param options Command options.
 * @returns Bulk string reply: The ID of the added entry.
 * @see {@link https://redis.io/commands/xadd}
 */
declare function _command(
	key: string,
	id: XaddId,
	pairs: XaddPairs,
	options?: XaddOptions & { NOMKSTREAM?: false },
): string;

/**
 * Appends the specified stream entry to the stream at the specified `key`.
 * If the key does not exist, `XADD` will create a new key with the given stream value as a side effect of running this command.
 * You can turn off key creation with the `NOMKSTREAM` option.
 * - Available since: 5.0.0.
 * - Time complexity: O(1) when adding a new entry, O(N) when trimming where N being the number of entries evicted.
 * @param key The name of the stream key.
 * @param id The stream entry ID. Use `*` to auto-generate a unique ID, or specify a well-formed ID in the format `<ms>-<seq>` (for example, `1526919030474-55`).
 * @param pairs One or more field-value pairs that make up the stream entry. You must provide at least one field-value pair.
 * @param options Command options.
 * @returns
 * - Bulk string reply: The ID of the added entry.
 * - Nil reply: if the NOMKSTREAM option is given and the key doesn't exist.
 * @see {@link https://redis.io/commands/xadd}
 */
declare function _command(
	key: string,
	id: XaddId,
	pairs: XaddPairs,
	options: XaddOptions & { NOMKSTREAM: true },
): string | null;

/**
 * Appends the specified stream entry to the stream at the specified `key`.
 * If the key does not exist, `XADD` will create a new key with the given stream value as a side effect of running this command.
 * You can turn off key creation with the `NOMKSTREAM` option.
 * - Available since: 5.0.0.
 * - Time complexity: O(1) when adding a new entry, O(N) when trimming where N being the number of entries evicted.
 * @param key The name of the stream key.
 * @param id The stream entry ID. Use `*` to auto-generate a unique ID, or specify a well-formed ID in the format `<ms>-<seq>` (for example, `1526919030474-55`).
 * @param pairs One or more field-value pairs that make up the stream entry. You must provide at least one field-value pair.
 * @param options Command options.
 * @returns
 * - Bulk string reply: The ID of the added entry.
 * - Nil reply: if the NOMKSTREAM option is given and the key doesn't exist.
 * @see {@link https://redis.io/commands/xadd}
 */
declare function _command(
	key: string,
	id: XaddId,
	pairs: XaddPairs,
	options?: XaddOptions,
): string | null;

// eslint-disable-next-line jsdoc/require-jsdoc
export function input(
	key: string,
	id: XaddId,
	pairs: XaddPairs,
	options?: XaddOptions,
): Command<string | null> {
	// Build command arguments
	const cmdArgs: string[] = ['XADD', key];

	// Add options if present
	if (options) {
		if (options.NOMKSTREAM) {
			cmdArgs.push('NOMKSTREAM');
		}

		if (options.trim) {
			cmdArgs.push(options.trim.strategy);

			if (options.trim.operator) {
				cmdArgs.push(options.trim.operator);
			}

			if (options.trim.threshold !== undefined) {
				cmdArgs.push(String(options.trim.threshold));
			}

			if (options.trim.LIMIT !== undefined) {
				cmdArgs.push('LIMIT', String(options.trim.LIMIT));
			}
		}
	}

	// Add ID
	cmdArgs.push(id);

	// Add fields and values
	for (const [field, value] of Object.entries(pairs)) {
		if (value === undefined) {
			continue;
		}

		cmdArgs.push(field, String(value));
	}

	return {
		kind: '#schema',
		args: cmdArgs,
	};
}
