import type { Command } from '../../types.js';

/**
 * Returns the number of elements in the sorted set at key with a score between min and max.
 *
 * The min and max arguments have the same semantic as described for ZRANGEBYSCORE.
 *
 * Note: the command has a complexity of just O(log(N)) because it uses elements ranks (see ZRANK) to get an idea of the range.
 * Because of this there is no need to do a work proportional to the size of the range.
 * - Available since: 2.0.0.
 * - Time complexity: O(log(N)) with N being the number of elements in the sorted set.
 * @param key The key of the sorted set.
 * @param min The minimum score to include in the count. Can be "-inf" for negative infinity, or a number prefixed with "(" to exclude that value.
 * @param max The maximum score to include in the count. Can be "+inf" for positive infinity, or a number prefixed with "(" to exclude that value.
 * @returns The number of elements in the specified score range.
 * @see {@link https://redis.io/commands/zcount}
 */
export function input(
	key: string,
	min: number | `(${number}` | '-inf',
	max: number | `(${number}` | '+inf',
): Command<number> {
	return {
		kind: '#schema',
		args: [
			'ZCOUNT',
			key,
			String(min),
			String(max),
		],
	};
}
