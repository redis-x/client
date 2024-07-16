import { OnlyOneFrom, InputReturnType } from '../../types';
import { SetOptionsJsdoc } from './set.jsdoc';
type SetOptionsCommon = OnlyOneFrom<{
    NX: true;
    XX: true;
}> & OnlyOneFrom<{
    EX: number;
    PX: number;
    EXAT: number;
    PXAT: number;
    KEEPTTL: true;
}>;
type SetOptionsModifierGet = {
    GET: true;
};
export type SetOptions = SetOptionsCommon & Partial<Record<keyof SetOptionsModifierGet, never>> & SetOptionsJsdoc;
export type SetOptionsWithGet = SetOptionsCommon & SetOptionsModifierGet & SetOptionsJsdoc;
/**
 * Set the string value of a key.
 * - Available since: 1.0.0.
 * - Time complexity: O(1).
 * @param key Key to set.
 * @param value Value to set.
 * @param options Options. See SetOptionsJsdoc.
 * @returns -
 */
export declare function input(key: string, value: string, options: SetOptionsWithGet): InputReturnType<'GET'>;
/**
 * @param key -
 * @param value -
 * @param options -
 * @returns -
 */
export declare function input(key: string, value: string, options: SetOptions): InputReturnType;
/**
 * @param key -
 * @param value -
 * @returns -
 */
export declare function input(key: string, value: string): InputReturnType;
export {};