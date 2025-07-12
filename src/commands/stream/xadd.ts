import type { Command } from '../../types.js';

export type XaddId = '*' | (string & {});
export type XaddPairs = Record<string, string | number | undefined>;

export type XaddOptions = {
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
		 * The maximum number of entries to trim. By default, all entries that exceed the threshold
		 * are removed. With LIMIT, only the specified number of entries are removed.
		 * - Available since: 6.2.0.
		 */
		LIMIT?: number;
	};
};

export type XaddOptionsNomkstream = {
	/**
	 * Do not create the key if it does not exist. By default, the key is created automatically
	 * if it doesn't exist.
	 * - Available since: 6.2.0.
	 */
	NOMKSTREAM: boolean;
};

/**
 * Appends the specified stream entry to the stream at the specified key.
 * If the key does not exist, as a side effect of running this command the key is created
 * with a stream value. The creation of stream's key can be disabled with the NOMKSTREAM option.
 * - Available since: 5.0.0.
 * - Time complexity: O(1) when adding a new entry, O(N) when trimming where N being the number of entries evicted.
 * @param key The key of the stream.
 * @param id The ID of the entry to add. Use * to auto-generate an ID. You can also specify a custom ID.
 * @param pairs A key-value pairs to add to the stream. Must be an even number of arguments.
 * @returns The ID of the added entry.
 * @see {@link https://redis.io/commands/xadd}
 */
declare function _command(key: string, id: XaddId, pairs: XaddPairs): string;

/**
 * Appends the specified stream entry to the stream at the specified key.
 * If the key does not exist, as a side effect of running this command the key is created
 * with a stream value. The creation of stream's key can be disabled with the NOMKSTREAM option.
 * - Available since: 5.0.0.
 * - Time complexity: O(1) when adding a new entry, O(N) when trimming where N being the number of entries evicted.
 * @param key The key of the stream.
 * @param id The ID of the entry to add. Use * to auto-generate an ID. You can also specify a custom ID.
 * @param pairs A key-value pairs to add to the stream. Must be an even number of arguments.
 * @param options Command options.
 * @returns The ID of the added entry.
 * @see {@link https://redis.io/commands/xadd}
 */
declare function _command(
	key: string,
	id: XaddId,
	pairs: XaddPairs,
	options: XaddOptions,
): string;

/**
 * Appends the specified stream entry to the stream at the specified key.
 * If the key does not exist, as a side effect of running this command the key is created
 * with a stream value. The creation of stream's key can be disabled with the NOMKSTREAM option.
 * - Available since: 5.0.0.
 * - Time complexity: O(1) when adding a new entry, O(N) when trimming where N being the number of entries evicted.
 * @param key The key of the stream.
 * @param id The ID of the entry to add. Use * to auto-generate an ID. You can also specify a custom ID.
 * @param pairs A key-value pairs to add to the stream. Must be an even number of arguments.
 * @param options Command options.
 * @returns The ID of the added entry, or `null` the key doesn't exist.
 * @see {@link https://redis.io/commands/xadd}
 */
declare function _command(
	key: string,
	id: XaddId,
	pairs: XaddPairs,
	options: XaddOptions & XaddOptionsNomkstream,
): string | null;

// eslint-disable-next-line jsdoc/require-jsdoc
export function input(
	key: string,
	id: XaddId,
	pairs: XaddPairs,
	options?: XaddOptions & Partial<XaddOptionsNomkstream>,
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
	cmdArgs.push(String(id));

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
