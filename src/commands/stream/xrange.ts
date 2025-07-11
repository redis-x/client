import type { Command } from '../../types.js';
import type { XStreamEntry } from './xread.js';
import { stringBulkToObject } from '../../utils.js';

export type XRangeOptions = {
	/**
	 * Maximum number of entries to return.
	 * - Available since: 5.0.0.
	 */
	COUNT?: number,
};

/**
 * Returns the stream entries matching a given range of IDs.
 *
 * The range is specified by a minimum and maximum ID. All the entries having an ID
 * between the two specified or exactly one of the two IDs specified (closed interval)
 * are returned.
 *
 * Special IDs `-` and `+` mean respectively the minimum ID possible and the maximum
 * ID possible inside a stream.
 *
 * Exclusive ranges can be specified by prefixing the ID with `(`.
 *
 * - Available since: 5.0.0.
 * - Time complexity: O(N) with N being the number of elements being returned. If N is constant (e.g. always asking for the first 10 elements with COUNT), you can consider it O(1).
 * @param key Key that contains the stream.
 * @param start Start ID for the range query. Use `-` for the minimum ID possible or prefix with `(` for exclusive range.
 * @param end End ID for the range query. Use `+` for the maximum ID possible or prefix with `(` for exclusive range.
 * @param options Command options.
 * @returns An array of stream entries matching the range.
 * @see {@link https://redis.io/commands/xrange}
 */
export function input(
	key: string,
	start: '-' | (string & {}),
	end: '+' | (string & {}),
	options?: XRangeOptions,
): Command<XStreamEntry[]> {
	const args: string[] = [
		'XRANGE',
		key,
		start,
		end,
	];

	if (options?.COUNT !== undefined) {
		args.push('COUNT', String(options.COUNT));
	}

	return {
		kind: '#schema',
		args,
		replyTransform(reply: [string, string[]][]) {
			return reply.map(([ id, data ]) => {
				return {
					id,
					data: stringBulkToObject(data),
				};
			});
		},
	};
}
