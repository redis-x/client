import {
	describe,
	expect,
	test,
} from 'vitest';
import { input } from './zinterstore.js';

describe('command', () => {
	test('list of keys', () => {
		const command = input('destination', [ 'foo', 'bar' ]);

		expect(
			command.args,
		).toStrictEqual([
			'ZINTERSTORE',
			'destination',
			'2',
			'foo',
			'bar',
		]);

		expect(command.replyTransform).toBeUndefined();
	});

	test('keys with weights', () => {
		const command = input(
			'destination',
			{
				foo: 1,
				bar: 2,
			},
		);

		expect(
			command.args,
		).toStrictEqual([
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

	test('keys with options', () => {
		const command = input(
			'destination',
			[ 'foo', 'bar' ],
			{
				AGGREGATE: 'SUM',
			},
		);

		expect(
			command.args,
		).toStrictEqual([
			'ZINTERSTORE',
			'destination',
			'2',
			'foo',
			'bar',
			'AGGREGATE',
			'SUM',
		]);

		expect(command.replyTransform).toBeUndefined();
	});
});
