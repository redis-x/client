import type { Command } from '../../types.js';

/**
 * Sets the specified fields to their respective values in the hash stored at key.
 * - Available since: 2.0.0.
 * - Multiple field/value pairs are available since Redis 4.0.0.
 * - Time complexity: O(1) for each field/value pair added.
 * @param key Key that contains the hash.
 * @param field Field to set.
 * @param value Value to set.
 * @returns The number of fields that were added.
 */
declare function _command(
	key: string,
	field: string,
	value: string | number,
): number;

/**
 * Sets the specified fields to their respective values in the hash stored at key.
 * - Available since: 2.0.0.
 * - Multiple field/value pairs are available since Redis 4.0.0.
 * - Time complexity: O(1) for each field/value pair added.
 * @param key Key that contains the hash.
 * @param pairs Object containing field/value pairs to set.
 * @returns The number of fields that were added.
 */
declare function _command(
	key: string,
	pairs: Record<
		string,
		string | number
	>
): number;

// eslint-disable-next-line jsdoc/require-jsdoc
export function input(
	key: string,
	arg1:
		| string
		| Record<
			string,
			string | number
		>,
	arg2?: string | number,
): Command {
	const pairs: string[] = [];

	if (typeof arg1 === 'string') {
		pairs.push(
			arg1,
			String(arg2),
		);
	}
	else {
		for (const [ field, value ] of Object.entries(arg1)) {
			pairs.push(
				field,
				String(value),
			);
		}
	}

	return {
		kind: '#schema',
		args: [
			'HSET',
			key,
			...pairs,
		],
	};
}
