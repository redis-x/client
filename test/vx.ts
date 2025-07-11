import * as v from 'valibot';

export interface StrictParser<
	TSchema extends v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>,
	TConfig extends v.Config<v.InferIssue<TSchema>> | undefined,
> {
	(input: v.InferInput<TSchema>): v.InferOutput<TSchema>;
	readonly schema: TSchema;
	readonly config: TConfig;
}

export function strictParser<
	const TSchema extends v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>,
>(schema: TSchema): StrictParser<TSchema, undefined>;

export function strictParser<
	const TSchema extends v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>,
	const TConfig extends v.Config<v.InferIssue<TSchema>> | undefined,
>(schema: TSchema, config: TConfig): StrictParser<TSchema, TConfig>;

// eslint-disable-next-line jsdoc/require-jsdoc
export function strictParser(
	schema: v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>,
	config?: v.Config<
		v.InferIssue<v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>>
	>,
): StrictParser<
		v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>,
		v.Config<v.BaseIssue<unknown>> | undefined
	> {
	// eslint-disable-next-line func-style
	const func: StrictParser<
		v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>,
		v.Config<v.BaseIssue<unknown>> | undefined
	> = (input: unknown) => v.parse(schema, input, config);
	/// @ts-expect-error 123
	func.schema = schema;
	/// @ts-expect-error 123
	func.config = config;
	return func;
}
