import { describe, expect, test } from 'vitest';
import {
	type Collection,
	collectionToStringArray,
	stringBulkToObject,
} from './utils.js';

describe('collectionToStringArray', () => {
	test.each<[string, () => Collection<string>]>([
		['array', () => ['foo', 'bar']],
		['readonly array', () => ['foo', 'bar'] as const],
		['set', () => new Set(['foo', 'bar'])],
		[
			'map keys',
			() =>
				new Map([
					['foo', 1],
					['bar', 2],
				]).keys(),
		],
		[
			'map values',
			() =>
				new Map([
					['first', 'foo'],
					['second', 'bar'],
				]).values(),
		],
		['array iterator', () => ['foo', 'bar'].values()],
		[
			'generator',
			function* () {
				yield 'foo';
				yield 'bar';
			},
		],
	])('converts %s', (_name, createValues) => {
		expect(collectionToStringArray(createValues())).toStrictEqual([
			'foo',
			'bar',
		]);
	});

	test('converts numbers to strings', () => {
		expect(collectionToStringArray([1, 'foo', 2.5])).toStrictEqual([
			'1',
			'foo',
			'2.5',
		]);
	});

	test('keeps order and duplicates', () => {
		expect(collectionToStringArray(['foo', 'bar', 'foo'])).toStrictEqual([
			'foo',
			'bar',
			'foo',
		]);
	});

	test('converts an empty collection', () => {
		expect(collectionToStringArray(new Set<string>())).toStrictEqual([]);
	});
});

describe('stringBulkToObject', () => {
	test('empty input', () => {
		expect(stringBulkToObject([])).toStrictEqual({});
	});

	test('preserves __proto__ as an own data property', () => {
		const result = stringBulkToObject([
			'__proto__',
			'value',
			'constructor',
			'field',
			'normal',
			'kept',
		]);

		expect(Object.getPrototypeOf(result)).toBe(Object.prototype);
		expect(Object.entries(result)).toStrictEqual([
			['__proto__', 'value'],
			['constructor', 'field'],
			['normal', 'kept'],
		]);
		expect(Object.getOwnPropertyDescriptor(result, '__proto__')).toStrictEqual({
			value: 'value',
			writable: true,
			enumerable: true,
			configurable: true,
		});
	});

	test('keeps the last value for repeated fields', () => {
		const result = stringBulkToObject([
			'normal',
			'first',
			'__proto__',
			'first',
			'normal',
			'last',
			'__proto__',
			'last',
		]);

		expect(Object.entries(result)).toStrictEqual([
			['normal', 'last'],
			['__proto__', 'last'],
		]);
	});
});
