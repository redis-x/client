import type { Command } from '../../types.js';

/**
 * Sets the given keys to their respective values. MSET replaces existing values with new values, just as regular SET.
 * MSET is atomic, so all given keys are set at once. It is not possible for clients to see that some of the keys were updated while others are unchanged.
 * - Available since: 1.0.1.
 * - Time complexity: O(N) where N is the number of keys to set.
 * @param pairs A record of key-value pairs.
 * @returns "OK"
 * @see {@link https://redis.io/commands/mset}
 */
export function input(pairs: Record<string, string | number>): Command<'OK'> {
	const args: string[] = [ 'MSET' ];
	for (const [ key, value ] of Object.entries(pairs)) {
		args.push(key, String(value));
	}

	return {
		kind: '#schema',
		args,
	};
}
