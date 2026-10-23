import { describe, expect, test } from 'vitest';
import { input } from './zinterstore.js';

describe('command', () => {
	test('list of keys', () => {
		const command = input('destination', ['foo', 'bar']);

		expect(command.args).toStrictEqual([
			'ZINTERSTORE',
			'destination',
			'2',
			'foo',
			'bar',
		]);

		expect(command.replyTransform).toBeUndefined();
	});

	test('keys with weights', () => {
		const command = input('destination', {
			foo: 1,
			bar: 2,
		});

		expect(command.args).toStrictEqual([
			'ZINTERSTORE',
			'destination',
			'2',
			'foo',
			'bar',
			'WEIGHTS',
			'1',
			'2',
		]);

		expect(command.replyTransform).toBeUndefined();
	});

	for (const aggregate of ['SUM', 'MIN', 'MAX', 'COUNT'] as const) {
		test(`keys with AGGREGATE ${aggregate}`, () => {
			const command = input('destination', ['foo', 'bar'], {
				AGGREGATE: aggregate,
			});

			expect(command.args).toStrictEqual([
				'ZINTERSTORE',
				'destination',
				'2',
				'foo',
				'bar',
				'AGGREGATE',
				aggregate,
			]);

			expect(command.replyTransform).toBeUndefined();
		});
	}

	test('keys with weights and AGGREGATE COUNT', () => {
		const command = input(
			'destination',
			{ foo: 1, bar: 2 },
			{ AGGREGATE: 'COUNT' },
		);

		expect(command.args).toStrictEqual([
			'ZINTERSTORE',
			'destination',
			'2',
			'foo',
			'bar',
			'WEIGHTS',
			'1',
			'2',
			'AGGREGATE',
			'COUNT',
		]);

		expect(command.replyTransform).toBeUndefined();
	});
});
