import type { Command } from '../../types.js';
export type ZaddOptions = {
    /**
     * Only add new elements. Don't update already existing elements.
     * - Incompatible with option `XX`, `GT` and `LT`.
     * - Available since: 3.0.2.
     */
    NX?: boolean;
    /**
     * Only update elements that already exist. Don't add new elements.
     * - Incompatible with option `NX`, `GT` and `LT`.
     * - Available since: 3.0.2.
     */
    XX?: boolean;
    /**
     * Only update existing elements if the new score is greater than the current score. This flag doesn't prevent adding new elements.
     * - Incompatible with options `NX`, `XX` and `LT`.
     * - Available since: 6.2.0.
     */
    GT?: boolean;
    /**
     * Only update existing elements if the new score is less than the current score. This flag doesn't prevent adding new elements.
     * - Incompatible with option `NX`, `XX` and `GT`.
     * - Available since: 6.2.0.
     */
    LT?: boolean;
    /**
     * Modify the return value from the number of new elements added, to the total number of elements changed.
     * - Available since: 3.0.2.
     */
    CH?: boolean;
    /**
     * When this option is specified ZADD acts like ZINCRBY. Only one score-element pair can be specified in this mode.
     * - Available since: 3.0.2.
     */
    INCR?: boolean;
};
export declare function input(key: string, arg1: number | Record<string, number>, arg2?: string | ZaddOptions, arg3?: ZaddOptions): Command;
