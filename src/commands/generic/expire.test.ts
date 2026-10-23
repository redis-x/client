import { describe, expect, test } from 'vitest';
import { input } from './expire.js';

describe('command', () => {
	test('no options', () => {
		const command = input('key', 10);

		expect(command.args).toStrictEqual(['EXPIRE', 'key', '10']);

		expect(command.replyTransform).toBeTypeOf('function');
	});

	for (const option of ['NX', 'XX', 'GT', 'LT']) {
		describe(`option ${option}`, () => {
			for (const value of [true, false]) {
				test(String(value), () => {
					const command = input('key', 10, {
						[option]: value,
					});

					expect(command.args).toStrictEqual(
						value ? ['EXPIRE', 'key', '10', option] : ['EXPIRE', 'key', '10'],
					);
				});
			}
		});
	}
});
