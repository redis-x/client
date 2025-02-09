/* eslint-disable @stylistic/array-element-newline */
import {
	describe,
	expect,
	test,
} from 'vitest';
import { redisXClient } from '../../../test/client.js';
import { createRandomKey } from '../../../test/utils.js';
import { input } from './zrange.js';

describe('command', () => {
	test('without options', () => {
		const command = input('key', 1, 2);

		expect(
			command.args,
		).toStrictEqual([
			'ZRANGE',
			'key',
			'1',
			'2',
		]);

		expect(command.replyTransform!([ '1', '2' ])).toStrictEqual([ '1', '2' ]);
	});

	describe('option BY', () => {
		for (const value of [ 'SCORE', 'LEX' ] as const) {
			test(String(value), () => {
				const command = input(
					'key',
					1,
					2,
					{ BY: value },
				);

				expect(command.args).toStrictEqual(
					[ 'ZRANGE', 'key', '1', '2', `BY${value}` ],
				);
			});
		}
	});

	describe('option REV', () => {
		for (const value of [ true, false ]) {
			test(String(value), () => {
				const command = input(
					'key',
					1,
					2,
					{ REV: value },
				);

				expect(command.args).toStrictEqual(
					value
						? [ 'ZRANGE', 'key', '1', '2', 'REV' ]
						: [ 'ZRANGE', 'key', '1', '2' ],
				);
			});
		}
	});

	test('option LIMIT', () => {
		const command = input(
			'key',
			1,
			2,
			{ LIMIT: [ 3, 4 ] },
		);

		expect(command.args).toStrictEqual(
			[ 'ZRANGE', 'key', '1', '2', 'LIMIT', '3', '4' ],
		);
	});

	test('option WITHSCORES', () => {
		const command = input(
			'key',
			1,
			2,
			{ WITHSCORES: true },
		);

		expect(command.args).toStrictEqual(
			[ 'ZRANGE', 'key', '1', '2', 'WITHSCORES' ],
		);

		expect(command.replyTransform!([ 'foo', '2' ])).toStrictEqual([{
			member: 'foo',
			score: 2,
		}]);
	});
});

describe('returns', () => {
	test('string[]', async () => {
		const key = createRandomKey();

		await redisXClient.sendCommand('ZADD', key, 1, 'foo', 2, 'bar');

		const result = await redisXClient.ZRANGE(key, 0, -1);
		expect(result).toStrictEqual([ 'foo', 'bar' ]);

		const result_rev = await redisXClient.ZRANGE(key, 0, -1, { REV: true });
		expect(result_rev).toStrictEqual([ 'bar', 'foo' ]);
	});

	test('object[]', async () => {
		const key = createRandomKey();

		await redisXClient.sendCommand('ZADD', key, 1, 'foo', 2, 'bar');

		const result = await redisXClient.ZRANGE(key, 0, -1, { WITHSCORES: true });
		expect(result).toStrictEqual([
			{
				member: 'foo',
				score: 1,
			},
			{
				member: 'bar',
				score: 2,
			},
		]);
	});
});
