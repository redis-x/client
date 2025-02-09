import type { Command } from '../../types.js';

export type ZaddOptions = {
	/**
	 * Only add new elements. Don't update already existing elements.
	 * - Incompatible with option `XX`, `GT` and `LT`.
	 * - Available since: 3.0.2.
	 */
	NX?: boolean,
	/**
	 * Only update elements that already exist. Don't add new elements.
	 * - Incompatible with option `NX`, `GT` and `LT`.
	 * - Available since: 3.0.2.
	 */
	XX?: boolean,
	/**
	 * Only update existing elements if the new score is greater than the current score. This flag doesn't prevent adding new elements.
	 * - Incompatible with options `NX`, `XX` and `LT`.
	 * - Available since: 6.2.0.
	 */
	GT?: boolean,
	/**
	 * Only update existing elements if the new score is less than the current score. This flag doesn't prevent adding new elements.
	 * - Incompatible with option `NX`, `XX` and `GT`.
	 * - Available since: 6.2.0.
	 */
	LT?: boolean,
	/**
	 * Modify the return value from the number of new elements added, to the total number of elements changed.
	 * - Available since: 3.0.2.
	 */
	CH?: boolean,
	/**
	 * When this option is specified ZADD acts like ZINCRBY. Only one score-element pair can be specified in this mode.
	 * - Available since: 3.0.2.
	 */
	INCR?: boolean,
};

/**
 * Adds member with the specified score to the sorted set stored at key.
 * - Available since: 1.2.0
 * - Multiple score/member pairs are available since Redis 2.4.0.
 * - Time complexity: O(log(N)) for each item added, where N is the number of elements in the sorted set.
 * @param key - Key holds a sorted set.
 * @param score - Score associated with the member.
 * @param member - Member to add.
 * @param options -
 * @returns The number of fields that were added.
 */
declare function _command(
	key: string,
	score: number,
	member: string,
	options?: ZaddOptions,
): number;

/**
 * Adds all the specified members with the specified scores to the sorted set stored at key.
 * - Available since: 1.2.0
 * - Multiple score/member pairs are available since Redis 2.4.0.
 * - Time complexity: O(log(N)) for each item added, where N is the number of elements in the sorted set.
 * @param key - Key holds a sorted set.
 * @param pairs - Object containing score/member pairs to set.
 * @param options -
 * @returns The number of fields that were added.
 */
declare function _command(
	key: string,
	pairs: Record<string, number>,
	options?: Omit<ZaddOptions, 'INCR'>,
): number;

// eslint-disable-next-line jsdoc/require-jsdoc
export function input(
	key: string,
	arg1:
		| number
		| Record<string, number>,
	arg2?: string | ZaddOptions,
	arg3?: ZaddOptions,
): Command {
	const args = [
		'ZADD',
		key,
	];

	const pairs: string[] = [];

	if (typeof arg1 === 'number') {
		pairs.push(
			String(arg1),
			arg2 as string,
		);
	}
	else {
		for (const [ member, score ] of Object.entries(arg1)) {
			pairs.push(
				String(score),
				member,
			);
		}
	}

	const options = typeof arg2 === 'string' ? arg3 : arg2;

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
		replyTransform(result: string | number) {
			if (typeof result === 'string') {
				return Number.parseFloat(result);
			}

			return result;
		},
	};
}
