/**
 * Checks if a value is a plain object.
 * @param value Value to check.
 * @returns -
 */
export function isPlainObject(
	value: unknown,
): value is Record<string, unknown> {
	return (
		typeof value === 'object'
		&& value !== null
		&& !Array.isArray(value)
		&& value.constructor === Object
		&& Object.getPrototypeOf(value) === Object.prototype
	);
}

/**
 * Converts a string array to an object.
 * @param values A flat array containing the keys and the values.
 * @returns Object with keys and values.
 */
export function stringBulkToObject(values: string[]): Record<string, string> {
	const object: Record<string, string> = {};

	for (let index = 0; index < values.length; index += 2) {
		Object.defineProperty(object, values[index]!, {
			value: values[index + 1]!,
			writable: true,
			enumerable: true,
			configurable: true,
		});
	}

	return object;
}

export type Collection<T> = readonly T[] | ReadonlySet<T> | IterableIterator<T>;

/**
 * Converts a collection to a string array.
 * @param values Collection to convert.
 */
export function collectionToStringArray<T>(values: Collection<T>): string[] {
	return Array.from(values, String);
}
