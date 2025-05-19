/**
 * Insert all the specified elements at the head of the list stored at key.
 *
 * If key does not exist, it is created as empty list before performing the push operations.
 * - Available since: 1.0.0.
 * - Multiple field/value pairs are available since Redis 2.4.0.
 * - Time complexity: O(1) for each element added.
 * @param key -
 * @param elements -
 * @returns The length of the list after the push operation.
 */
export function input(key, ...elements) {
    return {
        kind: '#schema',
        args: [
            'LPUSH',
            key,
            ...elements.map(String),
        ],
    };
}
