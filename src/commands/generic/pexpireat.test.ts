import { describe, expect, test } from 'vitest';
import { input } from './pexpireat.js';

describe('command', () => {
	const timestamp = Date.now() + 3_600_000;

	test('no options', () => {
		const command = input('key', timestamp);

		expect(command.args).toStrictEqual(['PEXPIREAT', 'key', String(timestamp)]);

		expect(command.replyTransform).toBeTypeOf('function');
	});

	for (const option of ['NX', 'XX', 'GT', 'LT']) {
		describe(`option ${option}`, () => {
			for (const value of [true, false]) {
				test(String(value), () => {
					const command = input('key', timestamp, {
						[option]: value,
					});

					expect(command.args).toStrictEqual(
						value
							? ['PEXPIREAT', 'key', String(timestamp), option]
							: ['PEXPIREAT', 'key', String(timestamp)],
					);
				});
			}
		});
	}
});
