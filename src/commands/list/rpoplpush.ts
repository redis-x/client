import type { Command } from '../../types.js';

/**
 * Atomically returns and removes the last element (tail) of the list stored at source,
 * and pushes the element at the first element (head) of the list stored at destination.
 *
 * For example: consider source holding the list a,b,c, and destination holding the list x,y,z.
 * Executing RPOPLPUSH results in source holding a,b and destination holding c,x,y,z.
 *
 * If source does not exist, the value nil is returned and no operation is performed.
 * If source and destination are the same, the operation is equivalent to removing the
 * last element from the list and pushing it as first element of the list, so it can be
 * considered as a list rotation command.
 *
 * - Available since: 1.2.0.
 * - Time complexity: O(1).
 * @deprecated As of Redis version 6.2.0, this command is regarded as deprecated. It can be replaced by LMOVE with the RIGHT and LEFT arguments when migrating or writing new code.
 * @param source Source list key.
 * @param destination Destination list key.
 * @returns The element being popped and pushed, or `null` if the source list is empty.
 * @see {@link https://redis.io/commands/rpoplpush}
 */
export function input(
	source: string,
	destination: string,
): Command<string | null> {
	return {
		kind: '#schema',
		args: ['RPOPLPUSH', source, destination],
	};
}
