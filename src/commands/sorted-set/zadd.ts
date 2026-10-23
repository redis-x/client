import { doubleToNumber } from '../../reply-transformers/double-to-number.js';
import type { Command } from '../../types.js';

export type ZaddOptions = {
	/**
	 * Only add new members; do not update existing members.
	 * `NX` and `XX` are mutually exclusive, as are `GT` and `LT`.
	 * - Available since: 3.0.2.
	 */
	NX?: boolean;
	/**
	 * Only update existing members; do not add new members.
	 * `NX` and `XX` are mutually exclusive, as are `GT` and `LT`.
	 * - Available since: 3.0.2.
	 */
	XX?: boolean;
	/**
	 * Only update an existing member if the new score is greater than the current score. Does not prevent adding new members.
	 * `NX` and `XX` are mutually exclusive, as are `GT` and `LT`.
	 * - Available since: 6.2.0.
	 */
	GT?: boolean;
	/**
	 * Only update an existing member if the new score is less than the current score. Does not prevent adding new members.
	 * `NX` and `XX` are mutually exclusive, as are `GT` and `LT`.
	 * - Available since: 6.2.0.
	 */
	LT?: boolean;
	/**
	 * Change the return value from the number of added members to the number of changed members (added plus updated).
	 * - Available since: 3.0.2.
	 */
	CH?: boolean;
	/**
	 * Increment the member's score by `score` instead of setting it, behaving like `ZINCRBY`. Only one score-member pair may be given.
	 * - Available since: 3.0.2.
	 */
	INCR?: boolean;
};

/**
 * Adds all the specified members with the specified scores to the sorted set stored at `key`.
 * - Available since: 1.2.0
 * - Starting with Redis version 2.4.0: Accepts multiple elements.
 * - Time complexity: O(log(N)) for each item added, where N is the number of elements in the sorted set.
 * @param key - The name of the key that holds the sorted set.
 * @param score - `score` is a double-precision floating-point number.
 * @param member -
 * @param options -
 * @returns Any of the following:
 * - Integer reply: the number of new members when the CH option is not used.
 * - Integer reply: the number of new or updated members when the CH option is used.
 * @see {@link https://redis.io/commands/zadd}
 */
declare function _command(
	key: string,
	score: number,
	member: string | number,
	options?: ZaddOptions & { INCR?: false },
): number;

/**
 * Adds all the specified members with the specified scores to the sorted set stored at `key`.
 * - Available since: 1.2.0
 * - Starting with Redis version 3.0.2: Added the `XX`, `NX`, `CH` and `INCR` options.
 * - Time complexity: O(log(N)) for each item added, where N is the number of elements in the sorted set.
 * @param key - The name of the key that holds the sorted set.
 * @param score - `score` is a double-precision floating-point number.
 * @param member -
 * @param options -
 * @returns Any of the following:
 * - Nil reply: if the operation was aborted because of a conflict with one of the XX/NX/LT/GT options.
 * - Bulk string reply: the updated score of the member when the INCR option is used.
 * @see {@link https://redis.io/commands/zadd}
 */
declare function _command(
	key: string,
	score: number,
	member: string | number,
	options: ZaddOptions & { INCR: true },
): number | null;

/**
 * Adds all the specified members with the specified scores to the sorted set stored at `key`.
 * - Available since: 1.2.0
 * - Starting with Redis version 2.4.0: Accepts multiple elements.
 * - Time complexity: O(log(N)) for each item added, where N is the number of elements in the sorted set.
 * @param key - The name of the key that holds the sorted set.
 * @param pairs - One or more score-member pairs to add or update.
 * @param options -
 * @returns Any of the following:
 * - Integer reply: the number of new members when the CH option is not used.
 * - Integer reply: the number of new or updated members when the CH option is used.
 * @see {@link https://redis.io/commands/zadd}
 */
declare function _command(
	key: string,
	pairs: Record<string, number>,
	options?: ZaddOptions & { INCR?: false },
): number;

/**
 * Adds all the specified members with the specified scores to the sorted set stored at `key`.
 * - Available since: 1.2.0
 * - Starting with Redis version 3.0.2: Added the `XX`, `NX`, `CH` and `INCR` options.
 * - Time complexity: O(log(N)) for each item added, where N is the number of elements in the sorted set.
 * @param key - The name of the key that holds the sorted set.
 * @param score - `score` is a double-precision floating-point number.
 * @param member -
 * @param options -
 * @returns Any of the following:
 * - Nil reply: if the operation was aborted because of a conflict with one of the XX/NX/LT/GT options.
 * - Integer reply: the number of new members when the CH option is not used.
 * - Integer reply: the number of new or updated members when the CH option is used.
 * - Bulk string reply: the updated score of the member when the INCR option is used.
 * @see {@link https://redis.io/commands/zadd}
 */
declare function _command(
	key: string,
	score: number,
	member: string | number,
	options?: ZaddOptions,
): number | null;

// eslint-disable-next-line jsdoc/require-jsdoc
export function input(
	key: string,
	arg1: number | Record<string, number>,
	arg2?: string | number | ZaddOptions,
	arg3?: ZaddOptions,
): Command {
	const args = ['ZADD', key];

	const pairs: string[] = [];

	if (typeof arg1 === 'number') {
		pairs.push(String(arg1), String(arg2));
	} else {
		for (const [member, score] of Object.entries(arg1)) {
			pairs.push(String(score), member);
		}
	}

	const options =
		typeof arg2 === 'string' || typeof arg2 === 'number' ? arg3 : arg2;

	if (options) {
		if (options.NX) {
			args.push('NX');
		}

		if (options.XX) {
			args.push('XX');
		}

		if (options.GT) {
			args.push('GT');
		}

		if (options.LT) {
			args.push('LT');
		}

		if (options.CH) {
			args.push('CH');
		}

		if (options.INCR) {
			args.push('INCR');
		}
	}

	args.push(...pairs);

	return {
		kind: '#schema',
		args,
		replyTransform(result: string | number | null) {
			if (typeof result === 'string') {
				return doubleToNumber(result);
			}

			return result;
		},
	};
}
