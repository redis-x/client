import type { BaseSchema } from "../../types";
export interface GetSchema extends BaseSchema {
	args: ["GET", string];
	replyTransform: (value: string | null) => string | null;
}
/**
 * Get the value of key.
 *
 * If the key does not exist `null` is returned.
 *
 * An error is returned if the value stored at key is not a string, because GET only handles string values.
 * - Available since: 1.0.0.
 * - Time complexity: O(1).
 * @param key Key to get.
 * @returns The value of key, or `null` when key does not exist.
 */
export declare function GET(key: string): GetSchema;