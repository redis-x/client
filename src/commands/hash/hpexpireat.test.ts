import { describe, expect, test } from 'vitest';
import { input } from './hpexpireat.js';

describe('command', () => {
	test('one-shot iterator argument', () => {
		const command = input(
			'myhash',
			1700000000000,
			['field1', 'field2'].values(),
		);
		expect(command.args).toStrictEqual([
			'HPEXPIREAT',
			'myhash',
			'1700000000000',
			'FIELDS',
			'2',
			'field1',
			'field2',
		]);
	});

	test('no options', () => {
		const command = input('myhash', 1700000000000, ['field1', 2]);
		expect(command.args).toStrictEqual([
			'HPEXPIREAT',
			'myhash',
			'1700000000000',
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
					const command = input('myhash', 1700000000000, ['field1'], {
						[option]: value,
					});

					expect(command.args).toStrictEqual(
						value
							? [
									'HPEXPIREAT',
									'myhash',
									'1700000000000',
									option,
									'FIELDS',
									'1',
									'field1',
								]
							: [
									'HPEXPIREAT',
									'myhash',
									'1700000000000',
									'FIELDS',
									'1',
									'field1',
								],
					);
				});
			}
		});
	}
});
