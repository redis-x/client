import { describe, expect, test } from 'vitest';
import { stringBulkToObject } from './utils.js';

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
