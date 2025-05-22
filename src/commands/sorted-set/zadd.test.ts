/* eslint-disable @stylistic/array-element-newline */
import {
	describe,
	expect,
	test,
} from 'vitest';
import { input } from './zadd.js';

describe('command', () => {
	test('single pair', () => {
		const command = input('key', 1, 'member');

		expect(
			command.args,
		).toStrictEqual([
			'ZADD',
			'key',
			'1',
			'member',
		]);

		expect(command.replyTransform!('1')).toStrictEqual(1);
		expect(command.replyTransform!('-1')).toStrictEqual(-1);
		expect(command.replyTransform!('10.345')).toStrictEqual(10.345);
		expect(command.replyTransform!(null)).toBeNull();
	});

	test('multiple pairs', () => {
		const command = input(
			'key',
			{
				foo: 1,
				bar: 2,
			},
		);

		expect(
			command.args,
		).toStrictEqual([
			'ZADD',
			'key',
			'1',
			'foo',
			'2',
			'bar',
		]);
	});

	for (const option of [ 'NX', 'XX', 'GT', 'LT', 'CH', 'INCR' ]) {
		describe(`option ${option}`, () => {
			for (const value of [ true, false ]) {
				test(String(value), () => {
					const command = input(
						'key',
						1,
						'foo',
						{
							[option]: value,
						},
					);

					expect(command.args).toStrictEqual(
						value
							? [ 'ZADD', 'key', option, '1', 'foo' ]
							: [ 'ZADD', 'key', '1', 'foo' ],
					);
				});
			}
		});
	}
});
