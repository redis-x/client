import { stringBulkToObject } from '../../utils.js';
/**
 * Returns all fields and values of the hash stored at key.
 * - Available since: 2.0.0.
 * - Time complexity: O(N) where N is the size of the hash.
 * @param key -
 * @returns A record of fields and their values stored in the hash.
 */
export function input(key) {
    return {
        kind: '#schema',
        args: [
            'HGETALL',
            key,
        ],
        replyTransform: stringBulkToObject,
    };
}
