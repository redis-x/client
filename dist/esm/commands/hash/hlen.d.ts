import type { BaseSchema } from "../../types";
export interface HlenSchema extends BaseSchema {
	args: ["HLEN", string];
	replyTransform: (value: number) => number;
}
/**
 * Returns the number of fields contained in the hash stored at key.
 * - Available since: 2.0.0.
 * - Time complexity: O(1).
 * @param key -
 * @returns Value of the key.
 */
export declare function HLEN(key: string): HlenSchema;