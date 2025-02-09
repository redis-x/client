import type { Command } from '../../types.js';
export type ZrangeOptions = {
    /**
     * Returns the range of elements from the sorted set having scores equal or between `<start>` and `<stop>`.
     * - Available since: 6.2.0.
     */
    BY?: 'SCORE' | 'LEX';
    /**
     * Reverses the ordering, so elements are ordered from highest to lowest score, and score ties are resolved by reverse lexicographical ordering.
     * - Available since: 6.2.0.
     */
    REV?: boolean;
    /**
     * Obtains a sub-range from the matching elements (similar to SELECT LIMIT offset, count in SQL). A negative `<count>` returns all elements from the `<offset>`.
     * - Available since: 6.2.0.
     */
    LIMIT?: [number, number];
    /**
     * Supplements the command's reply with the scores of elements returned.
     */
    WITHSCORES?: true;
};
export declare function input(key: string, start: string | number, stop: string | number, options?: ZrangeOptions): Command;
