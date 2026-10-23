import { describe, expect, test } from 'vitest';
import { stringCollectionCases } from '../../../test/collection-cases.js';
import { input } from './sunioncard.js';

test.each(stringCollectionCases)(
	'%s arguments',
	(_name, createValues, expected) => {
		const command = input(createValues());
		expect(command.args).toStrictEqual([
			'SUNIONCARD',
			String(expected.length),
			...expected,
		]);
	},
);

describe('command', () => {
	test('keys', () => {
		const command = input(['key1', 'key2']);
		expect(command.args).toStrictEqual(['SUNIONCARD', '2', 'key1', 'key2']);

		expect(command.replyTransform).toBeUndefined();
	});

	test('option APPROX', () => {
		const command = input(['key1', 'key2'], { APPROX: true });
		expect(command.args).toStrictEqual([
			'SUNIONCARD',
			'2',
			'key1',
			'key2',
			'APPROX',
		]);
	});

	test('option APPROX disabled', () => {
		const command = input(['key1', 'key2'], { APPROX: false });
		expect(command.args).toStrictEqual(['SUNIONCARD', '2', 'key1', 'key2']);
	});

	test('option LIMIT', () => {
		const command = input(['key1', 'key2'], { LIMIT: 3 });
		expect(command.args).toStrictEqual([
			'SUNIONCARD',
			'2',
			'key1',
			'key2',
			'LIMIT',
			'3',
		]);
	});

	test('option LIMIT zero', () => {
		const command = input(['key1'], { LIMIT: 0 });
		expect(command.args).toStrictEqual([
			'SUNIONCARD',
			'1',
			'key1',
			'LIMIT',
			'0',
		]);
	});

	test('options APPROX and LIMIT', () => {
		const command = input(['key1', 'key2'], { APPROX: true, LIMIT: 100 });
		expect(command.args).toStrictEqual([
			'SUNIONCARD',
			'2',
			'key1',
			'key2',
			'APPROX',
			'LIMIT',
			'100',
		]);
	});
});
