import type { Collection } from '../src/utils.js';

type CollectionCase<T> = [
	name: string,
	createValues: () => Collection<T>,
	expected: readonly string[],
];

export const stringCollectionCases = createCollectionCases('bar', 'bar');
export const mixedCollectionCases = createCollectionCases(0, '0');

/**
 * Creates reusable collection cases with fresh values for each test invocation.
 * @param second Second value in each non-empty collection.
 * @param expectedSecond Expected serialized second value.
 * @returns Collection factories and expected arguments.
 */
function createCollectionCases<T extends string | number>(
	second: T,
	expectedSecond: string,
): CollectionCase<string | T>[] {
	const expected = ['foo', expectedSecond];

	return [
		['readonly array', () => ['foo', second] as const, expected],
		['set', () => new Set<string | T>(['foo', second]), expected],
		[
			'map keys',
			() =>
				new Map<string | T, boolean>([
					['foo', true],
					[second, false],
				]).keys(),
			expected,
		],
		[
			'map values',
			() =>
				new Map<string, string | T>([
					['first', 'foo'],
					['second', second],
				]).values(),
			expected,
		],
		['iterator', () => ['foo', second].values(), expected],
		['empty collection', () => new Set<string | T>(), []],
		[
			'generator with duplicates',
			function* () {
				yield 'foo';
				yield second;
				yield 'foo';
			},
			['foo', expectedSecond, 'foo'],
		],
	];
}
