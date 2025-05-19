import type { Command } from '../../types.js';
export type SetOptions = {
    /**
     * Only set the key if it does not already exist.
     * - Incompatible with option `XX`.
     * - Incompatible with option `GET` before 7.0.0.
     * - Available since: 2.6.12.
     */
    NX?: boolean;
    /**
     * Only set the key if it already exist.
     * - Incompatible with option `NX`.
     * - Available since: 2.6.12.
     */
    XX?: boolean;
    /**
     * Set the specified expire time, in *seconds*.
     * - Incompatible with options `PX`, `EXAT`, `PXAT` and `KEEPTTL`.
     * - Available since: 2.6.12.
     */
    EX?: number;
    /**
     * Set the specified expire time, in *milliseconds*.
     * - Incompatible with options `EX`, `EXAT`, `PXAT` and `KEEPTTL`.
     * - Available since: 2.6.12.
     */
    PX?: number;
    /**
     * Set the specified expire time, in *seconds*.
     * - Incompatible with options `EX`, `PX`, `PXAT` and `KEEPTTL`.
     * - Available since: 6.2.0.
     */
    EXAT?: number;
    /**
     * Set the specified expire time, in *milliseconds*.
     * - Incompatible with options `EX`, `PX`, `EXAT` and `KEEPTTL`.
     * - Available since: 6.2.0.
     */
    PXAT?: number;
    /**
     * Retain the time to live associated with the key.
     * - Incompatible with options `EX`, `PX`, `EXAT` and `PXAT`.
     * - Available since: 6.0.0.
     */
    KEEPTTL?: boolean;
    /**
     * Get the value of the key before the SET operation.
     * - Incompatible with option `NX` before 7.0.0.
     * - Available since: 6.2.0.
     */
    GET?: true;
};
export declare function input(key: string, value: string | number, options?: SetOptions): Command;
