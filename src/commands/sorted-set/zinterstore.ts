import type { Command } from '../../types.js';

export type ZinterstoreOptions = {
	/**
	 * How to combine the scores of members that exist in multiple sets: `SUM` (the default), `MIN`, `MAX`, or `COUNT`.
	 *
	 * When `AGGREGATE COUNT` is specified, the original element scores are ignored entirely.
	 * The resulting score for each element is determined by which input sets contain it, optionally scaled by `WEIGHTS`:
	 * - Without `WEIGHTS`, each input set containing the element contributes `1` to its score — effectively counting set membership.
	 * - With `WEIGHTS`, each input set containing the element contributes its corresponding weight, so the score becomes the sum of those weights.
	 *
	 * Starting with Redis version 8.8.0: Added `COUNT` aggregate option.
	 * @see {@link https://redis.io/docs/latest/commands/zunionstore/}
	 */
	AGGREGATE?: 'SUM' | 'MIN' | 'MAX' | 'COUNT';
};

/**
 * Computes the intersection of sorted sets given by the specified keys, and stores the result in destination. It is mandatory to provide the number of input keys (numkeys) before passing the input keys and the other (optional) arguments.
 * - Available since: 2.0.0.
 * - Time complexity: O(N*K)+O(M*log(M)).
 * @param destination Destination key where the resulting sorted set should be stored.
 * @param keys List of keys that holds sorted sets.
 * @param options -
 * @returns The number of members in the resulting sorted set at the destination.
 * @see {@link https://redis.io/commands/zinterstore}
 */
declare function _command(
	destination: string,
	keys: (string | number)[],
	options?: ZinterstoreOptions,
): number;

/**
 * Computes the intersection of sorted sets given by the specified keys, and stores the result in destination. It is mandatory to provide the number of input keys (numkeys) before passing the input keys and the other (optional) arguments.
 * - Available since: 2.0.0.
 * - Time complexity: O(N*K)+O(M*log(M)).
 * @param destination Destination key where the resulting sorted set should be stored.
 * @param keys_with_weights Record where keys are the keys that holds sorted sets and values are the weights to apply to the sorted sets.
 * @param options -
 * @returns The number of members in the resulting sorted set at the destination.
 * @see {@link https://redis.io/commands/zinterstore}
 */
declare function _command(
	destination: string,
	keys_with_weights: Record<string, number>,
	options?: ZinterstoreOptions,
): number;

// eslint-disable-next-line jsdoc/require-jsdoc
export function input(
	destination: string,
	arg1: (string | number)[] | Record<string, number>,
	options?: ZinterstoreOptions,
): Command<number> {
	const args = ['ZINTERSTORE', destination];

	if (Array.isArray(arg1)) {
		args.push(String(arg1.length), ...arg1.map(String));
	} else {
		const entries = Object.entries(arg1);
		args.push(String(entries.length));

		const weights = [];
		for (const [key, weight] of entries) {
			args.push(key);
			weights.push(String(weight));
		}

		args.push('WEIGHTS', ...weights);
	}

	if (options?.AGGREGATE) {
		args.push('AGGREGATE', options.AGGREGATE);
	}

	return {
		kind: '#schema',
		args,
	};
}
