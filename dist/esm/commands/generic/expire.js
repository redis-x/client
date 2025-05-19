/**
 * Set a timeout on key.
 *
 * After the timeout has expired, the key will automatically be deleted.
 * - Available since: 1.0.0.
 * - Time complexity: O(1).
 * @param key Key to get.
 * @param seconds Time to live in seconds.
 * @param options Command options.
 * @returns Returns `1` if the timeout was set. Returns `0` if the timeout was not set; for example, the key doesn't exist, or the operation was skipped because of the provided arguments.
 */
export function input(key, seconds, options) {
    const args_options = [];
    if (options) {
        if (options.NX) {
            args_options.push('NX');
        }
        if (options.XX) {
            args_options.push('XX');
        }
        if (options.GT) {
            args_options.push('GT');
        }
        if (options.LT) {
            args_options.push('LT');
        }
    }
    return {
        kind: '#schema',
        args: [
            'EXPIRE',
            key,
            String(seconds),
            ...args_options,
        ],
    };
}
