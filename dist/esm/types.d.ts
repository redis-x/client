export interface BaseSchema {
	kind: "#schema";
	args: string[];
	replyTransform: (result: any) => unknown;
}
/**
 * Checks if a value is a schema.
 * @param value Value to check.
 * @returns Returns `true` if the value is a schema, otherwise `false`.
 */
export declare function isSchema(value: unknown): value is BaseSchema;
export type InferReply<T extends BaseSchema> =
	T["replyTransform"] extends Required<BaseSchema>["replyTransform"]
		? ReturnType<T["replyTransform"]>
		: never;
export type Mutable<T> = {
	-readonly [key in keyof T]: T[key];
};
export type ExactlyOneFrom<T, K extends keyof T = keyof T> = K extends keyof T
	? {
			[P in K]: T[P];
		} & Partial<Record<Exclude<keyof T, K>, never>>
	: never;
export type OneOrNoneFrom<T, K extends keyof T = keyof T> =
	| ExactlyOneFrom<T, K>
	| Partial<Record<keyof T, never>>;
export type TheseFieldsOrNone<T> = T | Partial<Record<keyof T, never>>;