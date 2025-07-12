import { describe, expect, test } from 'vitest';
import { input } from './zrange.js';

describe('command', () => {
	test('without options', () => {
		const command = input('key', 1, 2);

		expect(command.args).toStrictEqual(['ZRANGE', 'key', '1', '2']);

		expect(command.replyTransform!(['foo', 'bar'])).toStrictEqual([
			'foo',
			'bar',
		]);
	});

	describe('option BY', () => {
		for (const value of ['SCORE', 'LEX'] as const) {
			test(String(value), () => {
				const command = input('key', 1, 2, { BY: value });

				expect(command.args).toStrictEqual([
					'ZRANGE',
					'key',
					'1',
					'2',
					`BY${value}`,
				]);
			});
		}
	});

	describe('option REV', () => {
		for (const value of [true, false]) {
			test(String(value), () => {
				const command = input('key', 1, 2, { REV: value });

				expect(command.args).toStrictEqual(
					value
						? ['ZRANGE', 'key', '1', '2', 'REV']
						: ['ZRANGE', 'key', '1', '2'],
				);
			});
		}
	});

	test('option LIMIT', () => {
		const command = input('key', 1, 2, { LIMIT: [3, 4] });

		expect(command.args).toStrictEqual([
			'ZRANGE',
			'key',
			'1',
			'2',
			'LIMIT',
			'3',
			'4',
		]);
	});

	test('option WITHSCORES', () => {
		const command = input('key', 1, 2, { WITHSCORES: true });

		expect(command.args).toStrictEqual([
			'ZRANGE',
			'key',
			'1',
			'2',
			'WITHSCORES',
		]);

		expect(command.replyTransform!(['foo', '2', 'bar', '-1'])).toStrictEqual([
			{
				member: 'foo',
				score: 2,
			},
			{
				member: 'bar',
				score: -1,
			},
		]);
	});
});
