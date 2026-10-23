import { describe, expect, test } from 'vitest';
import { input } from './hpexpire.js';

describe('command', () => {
	test('one-shot iterator argument', () => {
		const command = input('myhash', 10000, ['field1', 'field2'].values());
		expect(command.args).toStrictEqual([
			'HPEXPIRE',
			'myhash',
			'10000',
			'FIELDS',
			'2',
			'field1',
			'field2',
		]);
	});

	test('no options', () => {
		const command = input('myhash', 10000, ['field1', 2]);
		expect(command.args).toStrictEqual([
			'HPEXPIRE',
			'myhash',
			'10000',
			'FIELDS',
			'2',
			'field1',
			'2',
		]);

		expect(command.replyTransform).toBeUndefined();
	});

	for (const option of ['NX', 'XX', 'GT', 'LT']) {
		describe(`option ${option}`, () => {
			for (const value of [true, false]) {
				test(String(value), () => {
					const command = input('myhash', 10000, ['field1'], {
						[option]: value,
					});

					expect(command.args).toStrictEqual(
						value
							? ['HPEXPIRE', 'myhash', '10000', option, 'FIELDS', '1', 'field1']
							: ['HPEXPIRE', 'myhash', '10000', 'FIELDS', '1', 'field1'],
					);
				});
			}
		});
	}
});
