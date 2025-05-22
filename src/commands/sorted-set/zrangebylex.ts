import type { Command } from '../../types.js';

export type ZrangebylexOptions = {
	/**
	 * Obtains a sub-range from the matching elements (similar to SELECT LIMIT offset, count in SQL). A negative `<count>` returns all elements from the `<offset>`.
	 * - Available since: 2.8.9.
	 */
	LIMIT?: [number, number],
};

/**
 * Returns all the elements in the sorted set at `key` with a value between `min` and `max`.
 *
 * The elements are considered to be ordered from lower to higher strings as compared byte-by-byte using the `memcmp()` C function.
 * Longer strings are considered greater than shorter strings if the common part is identical.
 *
 * Valid `min` and `max` must start with `(` or `[`, in order to specify if the range item is respectively exclusive or inclusive.
 * The special values of `+` or `-` for `min` and `max` have the special meaning or positively infinite and negatively infinite strings.
 *
 * - Available since: 2.8.9.
 * - Time complexity: O(log(N)+M) with N being the number of elements in the sorted set and M the number of elements being returned. If M is constant (e.g. always asking for the first 10 elements with LIMIT), you can consider it O(log(N)).
 * @deprecated As of Redis version 6.2.0, this command is regarded as deprecated. It can be replaced by ZRANGE with the BYLEX argument when migrating or writing new code.
 * @param key The key of the sorted set.
 * @param min Minimum value of the range.
 * @param max Maximum value of the range.
 * @param options Command options.
 * @returns List of elements in the specified range.
 * @see {@link https://redis.io/commands/zrangebylex}
 */
export function input(
	key: string,
	min: `(${string}` | `[${string}` | '-',
	max: `(${string}` | `[${string}` | '+',
	options?: ZrangebylexOptions,
): Command<string[]> {
	const args = [
		'ZRANGEBYLEX',
		key,
		min,
		max,
	];

	if (options?.LIMIT) {
		args.push(
			'LIMIT',
			String(options.LIMIT[0]),
			String(options.LIMIT[1]),
		);
	}

	return {
		kind: '#schema',
		args,
	};
}
