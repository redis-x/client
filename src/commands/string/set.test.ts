import { describe, expect, test } from 'vitest';
import { input } from './set.js';

describe('command', () => {
	test('no options', () => {
		const command = input('key', 'value');

		expect(command.args).toStrictEqual(['SET', 'key', 'value']);

		expect(command.replyTransform).toBeUndefined();
	});

	for (const option of ['NX', 'XX', 'KEEPTTL', 'GET']) {
		describe(`option ${option}`, () => {
			for (const value of [true, false]) {
				test(String(value), () => {
					const command = input('key', 'value', { [option]: value });

					expect(command.args).toStrictEqual(
						value ? ['SET', 'key', 'value', option] : ['SET', 'key', 'value'],
					);

					expect(command.replyTransform).toBeUndefined();
				});
			}
		});
	}

	for (const option of ['EX', 'PX', 'EXAT', 'PXAT']) {
		test(`option ${option}`, () => {
			const command = input('key', 'value', { [option]: 1000 });

			expect(command.args).toStrictEqual([
				'SET',
				'key',
				'value',
				option,
				'1000',
			]);

			expect(command.replyTransform).toBeUndefined();
		});

		test(`option ${option} with zero`, () => {
			const command = input('key', 'value', { [option]: 0 });

			expect(command.args).toStrictEqual(['SET', 'key', 'value', option, '0']);
		});
	}

	for (const option of ['IFEQ', 'IFNE'] as const) {
		for (const value of ['old value', '', 0]) {
			test(`option ${option} with ${JSON.stringify(value)}`, () => {
				const command = input('key', 'value', { [option]: value });

				expect(command.args).toStrictEqual([
					'SET',
					'key',
					'value',
					option,
					String(value),
				]);
			});
		}
	}

	for (const option of ['IFDEQ', 'IFDNE'] as const) {
		for (const digest of ['fedcba9876543210', '0000000000000000']) {
			test(`option ${option} with ${digest}`, () => {
				const command = input('key', 'value', { [option]: digest });

				expect(command.args).toStrictEqual([
					'SET',
					'key',
					'value',
					option,
					digest,
				]);
			});
		}
	}

	test('undefined conditions', () => {
		const command = input('key', 'value', {
			IFEQ: undefined,
			IFNE: undefined,
			IFDEQ: undefined,
			IFDNE: undefined,
		});

		expect(command.args).toStrictEqual(['SET', 'key', 'value']);
	});

	for (const option of ['IFEQ', 'IFNE', 'IFDEQ', 'IFDNE'] as const) {
		for (const get of [true, false]) {
			test(`option ${option} with GET ${get} and PX`, () => {
				const command = input('key', 'value', {
					[option]: '0123456789abcdef',
					GET: get,
					PX: 1000,
				});

				expect(command.args).toStrictEqual([
					'SET',
					'key',
					'value',
					option,
					'0123456789abcdef',
					'PX',
					'1000',
					...(get ? ['GET'] : []),
				]);
				expect(command.replyTransform).toBeUndefined();
			});
		}
	}
});
