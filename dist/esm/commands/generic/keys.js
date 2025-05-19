/**
 * Returns all keys matching pattern.
 * - Available since: 1.0.0.
 * - Time complexity: O(N) with N being the number of keys in the database.
 * @param pattern Pattern to match.
 * @returns A set of keys matching pattern.
 */
export function input(pattern) {
    return {
        kind: '#schema',
        args: [
            'KEYS',
            pattern,
        ],
        replyTransform,
    };
}
// eslint-disable-next-line jsdoc/require-jsdoc
function replyTransform(result) {
    return new Set(result);
}
