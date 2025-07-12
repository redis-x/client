import type { Command } from '../../types.js';
import { stringBulkToObject } from '../../utils.js';
import type { XStreamEntry } from './xread.js';

export type XRevrangeOptions = {
	/**
	 * Maximum number of entries to return.
	 * - Available since: 5.0.0.
	 */
	COUNT?: number;
};

/**
 * This command is exactly like XRANGE, but with the notable difference of returning the entries in reverse order,
 * and also taking the start-end range in reverse order:
 * in XREVRANGE you need to state the end ID and later the start ID,
 * and the command will produce all the element between (or exactly like) the two IDs, starting from the end side.
 *
 * - Available since: 5.0.0.
 * - Time complexity: O(N) with N being the number of elements being returned. If N is constant (e.g. always asking for the first 10 elements with COUNT), you can consider it O(1).
 * @param key Key that contains the stream.
 * @param end End ID for the range query. Use `+` for the maximum ID possible or prefix with `(` for exclusive range.
 * @param start Start ID for the range query. Use `-` for the minimum ID possible or prefix with `(` for exclusive range.
 * @param options Command options.
 * @returns An array of stream entries matching the range.
 * @see {@link https://redis.io/commands/xrange}
 */
export function input(
	key: string,
	end: '+' | (string & {}),
	start: '-' | (string & {}),
	options?: XRevrangeOptions,
): Command<XStreamEntry[]> {
	const args: string[] = ['XREVRANGE', key, end, start];

	if (options?.COUNT !== undefined) {
		args.push('COUNT', String(options.COUNT));
	}

	return {
		kind: '#schema',
		args,
		replyTransform(reply: [string, string[]][]) {
			return reply.map(([id, data]) => {
				return {
					id,
					data: stringBulkToObject(data),
				};
			});
		},
	};
}
