import type { Command } from '../../types.js';
export type ZinterstoreOptions = {
    /**
     * Specifies how the results of the intersection are aggregated.
     *
     * This option defaults to `SUM`, where the score of an element is summed across the inputs where it exists.
     *
     * When this option is set to either `MIN` or `MAX`, the resulting set will contain the minimum or maximum score of an element across the inputs where it exists.
     */
    AGGREGATE?: 'SUM' | 'MIN' | 'MAX';
};
export declare function input(destination: string, arg1: (string | number)[] | Record<string, number>, options?: ZinterstoreOptions): Command<number>;
