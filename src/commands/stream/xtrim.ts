import type { Command } from '../../types.js';

export type XtrimOptions = {
	/**
	 * When specified, Redis will stop trimming early when performance can be gained.
	 * The stream may have few tens of additional entries over the threshold.
	 * - Available since: 5.0.0.
	 */
	trimOperator?: '~' | '=',
	/**
	 * Specifies the maximal count of entries that will be evicted.
	 * When not specified, the default value of 100 * the number of entries in a macro node will be implicitly used.
	 * Specifying the value 0 disables the limiting mechanism entirely.
	 * - Available since: 6.2.0.
	 */
	LIMIT?: number,
};

/**
 * Trims the stream by evicting older entries (entries with lower IDs) if needed.
 *
 * Using MAXLEN strategy which evicts entries as long as the stream's length exceeds the specified threshold.
 *
 * - Available since: 5.0.0.
 * - Time complexity: O(N), with N being the number of evicted entries.
 * @param key The key of the stream.
 * @param strategy The MAXLEN trimming strategy.
 * @param threshold A positive integer representing the max length.
 * @param options Additional options.
 * @returns The number of entries deleted from the stream.
 * @see {@link https://redis.io/commands/xtrim}
 */
declare function _command(
	key: string,
	strategy: 'MAXLEN',
	threshold: number,
	options?: XtrimOptions,
): number;

/**
 * Trims the stream by evicting older entries (entries with lower IDs) if needed.
 *
 * Using MINID strategy which evicts entries with IDs lower than threshold.
 *
 * - Available since: 6.2.0.
 * - Time complexity: O(N), with N being the number of evicted entries.
 * @param key The key of the stream.
 * @param strategy The MINID trimming strategy.
 * @param threshold A stream ID threshold in the format of "timestamp-sequence" or "timestamp".
 * @param options Additional options.
 * @returns The number of entries deleted from the stream.
 * @see {@link https://redis.io/commands/xtrim}
 */
declare function _command(
	key: string,
	strategy: 'MINID',
	threshold: string,
	options?: XtrimOptions,
): number;

// eslint-disable-next-line jsdoc/require-jsdoc
export function input(
	key: string,
	strategy: 'MAXLEN' | 'MINID',
	threshold: number | string,
	options?: XtrimOptions,
): Command<number> {
	const args: string[] = [
		'XTRIM',
		key,
		strategy,
	];

	if (options?.trimOperator) {
		args.push(options.trimOperator);
	}

	args.push(String(threshold));

	if (options?.LIMIT !== undefined) {
		args.push('LIMIT', String(options.LIMIT));
	}

	return {
		kind: '#schema',
		args,
	};
}
