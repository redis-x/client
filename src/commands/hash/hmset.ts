import type { Command } from '../../types.js';

/**
 * Sets the specified fields to their respective values in the hash stored at key.
 * This command overwrites any specified fields already existing in the hash.
 * If key does not exist, a new key holding a hash is created.
 *
 * - Available since: 2.0.0.
 * - Time complexity: O(N) where N is the number of fields being set.
 * @deprecated As of Redis version 4.0.0, this command is regarded as deprecated. It can be replaced by HSET with multiple field-value pairs when migrating or writing new code.
 * @param key Key that contains the hash.
 * @param field Field to set.
 * @param value Value to set.
 * @returns Simple string reply: "OK".
 * @see {@link https://redis.io/commands/hmset}
 */
declare function _command(
	key: string,
	field: string,
	value: string | number,
): 'OK';

/**
 * Sets the specified fields to their respective values in the hash stored at key.
 * This command overwrites any specified fields already existing in the hash.
 * If key does not exist, a new key holding a hash is created.
 *
 * - Available since: 2.0.0.
 * - Time complexity: O(N) where N is the number of fields being set.
 * @deprecated As of Redis version 4.0.0, this command is regarded as deprecated. It can be replaced by HSET with multiple field-value pairs when migrating or writing new code.
 * @param key Key that contains the hash.
 * @param pairs Object containing field/value pairs to set.
 * @returns Simple string reply: "OK".
 * @see {@link https://redis.io/commands/hmset}
 */
declare function _command(
	key: string,
	pairs: Record<
		string,
		string | number
	>,
): 'OK';

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
): Command<'OK'> {
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
			'HMSET',
			key,
			...pairs,
		],
	};
}
