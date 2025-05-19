/* eslint-disable @stylistic/array-element-newline */
import {
	describe,
	expect,
	test,
} from 'vitest';
import { redisXClient } from '../../../test/client.js';
import { createRandomKey } from '../../../test/utils.js';
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

		expect(command.replyTransform!('1.23')).toStrictEqual(1.23);
		expect(command.replyTransform!(2)).toStrictEqual(2);
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

describe('returns', () => {
	test('number', async () => {
		const key = createRandomKey();

		const result = await redisXClient.ZADD(key, 1, 'foo');
		expect(result).toBe(1);
	});

	test('string', async () => {
		const key = createRandomKey();

		const result = await redisXClient.ZADD(key, 1.23, 'foo', { INCR: true });
		expect(result).toBe(1.23);
	});
});
