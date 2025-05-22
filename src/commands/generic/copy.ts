import { replyTransform } from '../../reply-transformers/number-to-boolean.js';
import type { Command } from '../../types.js';

export type CopyOptions = {
	/**
	 * Logical database index for the destination key.
	 * - Available since: 6.2.0.
	 */
	DB?: number,
	/**
	 * If true, will replace the destination key if it already exists.
	 * - Available since: 6.2.0.
	 */
	REPLACE?: boolean,
};

/**
 * Copy the value stored at the source key to the destination key.
 * - Available since: 6.2.0.
 * - Time complexity: O(N) worst case for collections, where N is the number of nested items. O(1) for string values.
 * @param source The source key.
 * @param destination The destination key.
 * @param options Command options.
 * @returns Whether the copy was successful.
 * @see {@link https://redis.io/commands/copy}
 */
export function input(
	source: string,
	destination: string,
	options?: CopyOptions,
): Command<boolean> {
	const args = [
		'COPY',
		source,
		destination,
	];

	if (options?.DB !== undefined) {
		args.push('DB', String(options.DB));
	}

	if (options?.REPLACE) {
		args.push('REPLACE');
	}

	return {
		kind: '#schema',
		args,
		replyTransform,
	};
}
