/**
 * Returns the score of member in the sorted set at key.
 * - Available since: 1.0.0.
 * - Time complexity: O(1).
 * @param key Key holds a sorted set.
 * @param member Member in the sorted set.
 * @returns The score of the member (a double-precision floating point number), represented as a string, or `null` if member does not exist in the sorted set, or the key does not exist.
 */
export function input(key, member) {
    return {
        kind: '#schema',
        args: [
            'ZSCORE',
            key,
            String(member),
        ],
        replyTransform(result) {
            return result ? Number.parseFloat(result) : null;
        },
    };
}
