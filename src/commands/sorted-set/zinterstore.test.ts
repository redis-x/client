import {
	describe,
	expect,
	test,
} from 'vitest';
import { redisXClient } from '../../../test/client.js';
import { createRandomKey } from '../../../test/utils.js';
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

describe('returns', () => {
	test('number', async () => {
		const key = createRandomKey();

		await Promise.all([
			redisXClient.sendCommand('ZADD', `${key}-1`, 1, 'foo', 2, 'bar'),
			redisXClient.sendCommand('ZADD', `${key}-2`, 2, 'foo', 3, 'baz'),
		]);

		const result = await redisXClient.ZINTERSTORE('dest', [ `${key}-1`, `${key}-2` ]);
		expect(result).toBe(1);
	});
});
