import { describe, expect, test } from 'vitest';
import { stringCollectionCases } from '../../../test/collection-cases.js';
import { input } from './sintercard.js';

test.each(stringCollectionCases)(
	'%s arguments',
	(_name, createValues, expected) => {
		const command = input(createValues());
		expect(command.args).toStrictEqual([
			'SINTERCARD',
			String(expected.length),
			...expected,
		]);
	},
);

describe('command', () => {
	test('keys', () => {
		const command = input(['key1', 'key2']);
		expect(command.args).toStrictEqual(['SINTERCARD', '2', 'key1', 'key2']);

		expect(command.replyTransform).toBeUndefined();
	});

	test('option LIMIT', () => {
		const command = input(['key1', 'key2'], { LIMIT: 1 });
		expect(command.args).toStrictEqual([
			'SINTERCARD',
			'2',
			'key1',
			'key2',
			'LIMIT',
			'1',
		]);
	});

	test('option LIMIT zero', () => {
		const command = input(['key1'], { LIMIT: 0 });
		expect(command.args).toStrictEqual([
			'SINTERCARD',
			'1',
			'key1',
			'LIMIT',
			'0',
		]);
	});
});
