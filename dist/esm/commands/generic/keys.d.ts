import type { Command } from '../../types.js';
/**
 * Returns all keys matching pattern.
 * - Available since: 1.0.0.
 * - Time complexity: O(N) with N being the number of keys in the database.
 * @param pattern Pattern to match.
 * @returns A set of keys matching pattern.
 */
export declare function input(pattern: string): Command<Set<string>>;
