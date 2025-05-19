import type { Command } from '../../types.js';
/**
 * Removes the specified keys.
 *
 * A key is ignored if it does not exist.
 * - Available since: 1.0.0.
 * - Time complexity: O(N) where N is the number of keys that will be removed. When a key to remove holds a value other than a string, the individual complexity for this key is O(M) where M is the number of elements in the list, set, sorted set or hash.
 * @param keys Keys to delete.
 * @returns The number of keys that were removed.
 */
export declare function input(...keys: string[]): Command<number>;
