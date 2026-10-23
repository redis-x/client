import { describe, expect, test } from 'vitest';
import { input } from './expireat.js';

describe('command', () => {
	test('no options', () => {
		const command = input('key', 1_735_689_600);

		expect(command.args).toStrictEqual(['EXPIREAT', 'key', '1735689600']);

		expect(command.replyTransform).toBeTypeOf('function');
	});

	for (const option of ['NX', 'XX', 'GT', 'LT']) {
		describe(`option ${option}`, () => {
			for (const value of [true, false]) {
				test(String(value), () => {
					const command = input('key', 1_735_689_600, {
						[option]: value,
					});

					expect(command.args).toStrictEqual(
						value
							? ['EXPIREAT', 'key', '1735689600', option]
							: ['EXPIREAT', 'key', '1735689600'],
					);
				});
			}
		});
	}
});
