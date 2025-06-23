import type { Command } from '../../types.js';
import { stringBulkToObject } from '../../utils.js';

export type XreadId = '$' | '+' | (string & {});

export type XReadOptions = {
	/**
	 * Maximum number of entries to return per stream.
	 * - Available since: 5.0.0.
	 */
	COUNT?: number,
	/**
	 * Block for the specified amount of time in milliseconds if no entries are available.
	 * If not specified, the command will return immediately.
	 * - Available since: 5.0.0.
	 */
	BLOCK?: number,
};

export type XStreamEntry = {
	id: string,
	data: Record<string, string>,
};

/**
 * Read data from one or multiple streams, only returning entries with an ID greater than the last received ID reported by the caller.
 *
 * - Available since: 5.0.0.
 * - Time complexity: O(N) where N is the number of entries returned.
 * @param key The name of the stream to read from.
 * @param id The last ID received from the stream.
 * @param options Command options.
 * @returns An array of stream entries or `null` if no entries are available.
 * @see {@link https://redis.io/commands/xread}
 */
declare function _command(key: string, id: XreadId, options?: XReadOptions): XStreamEntry[];

/**
 * Read data from one or multiple streams, only returning entries with an ID greater than the last received ID reported by the caller.
 *
 * - Available since: 5.0.0.
 * - Time complexity: O(N) where N is the number of entries returned.
 * @param streams Object where keys are stream names and values are the last IDs received from those streams.
 * @param options Command options.
 * @returns An object where keys are stream names and values are arrays of stream entries or `null` if no entries are available.
 * @see {@link https://redis.io/commands/xread}
 */
declare function _command<const S extends Record<string, XreadId>>(streams: S, options?: XReadOptions): { [K in keyof S]: XStreamEntry[] };

// eslint-disable-next-line jsdoc/require-jsdoc
export function input(
	arg0: string | Record<string, XreadId>,
	arg1?: XreadId | XReadOptions,
	arg2?: XReadOptions,
): Command<XStreamEntry[] | Record<string, XStreamEntry[] | null> | null> {
	let options: XReadOptions | undefined;
	const stream_keys: string[] = [];
	const stream_ids: string[] = [];

	if (typeof arg0 === 'string' && typeof arg1 === 'string') {
		stream_keys.push(arg0);
		stream_ids.push(arg1);
		options = arg2;
	}
	else {
		for (const [ key, id ] of Object.entries(arg0)) {
			stream_keys.push(key);
			stream_ids.push(id);
		}

		if (typeof arg1 !== 'string') {
			options = arg1;
		}
	}

	const args: string[] = [ 'XREAD' ];

	if (options) {
		if (options.COUNT !== undefined) {
			args.push('COUNT', String(options.COUNT));
		}

		if (options.BLOCK !== undefined) {
			args.push('BLOCK', String(options.BLOCK));
		}
	}

	args.push('STREAMS', ...stream_keys, ...stream_ids);

	return {
		kind: '#schema',
		args,
		replyTransform(reply: [string, [string, string[]][]][] | null) {
			reply ??= [];

			const result: Record<string, XStreamEntry[]> = {};
			for (const key of stream_keys) {
				result[key] = [];
			}

			for (const [ key, entries ] of reply) {
				for (const [ id, data ] of entries) {
					result[key]!.push({
						id,
						data: stringBulkToObject(data),
					});
				}
			}

			if (typeof arg0 === 'string') {
				return result[arg0]!;
			}

			return result;
		},
	};
}
