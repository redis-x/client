import {
	describe,
	expect,
	test,
} from 'vitest';
import { redisXClient } from '../../../test/client.js';
import { createRandomKey } from '../../../test/utils.js';
import { input } from './hset.js';

describe('command', () => {
	test('inline pair', () => {
		const command = input('key', 'apple', 'red');

		expect(command.args).toStrictEqual([
			'HSET',
			'key',
			'apple',
			'red',
		]);

		expect(command.replyTransform).toBeUndefined();
	});

	test('object', () => {
		const command = input(
			'key',
			{
				apple: 'red',
				banana: 'yellow',
			},
		);

		expect(command.args).toStrictEqual([
			'HSET',
			'key',
			'apple',
			'red',
			'banana',
			'yellow',
		]);

		expect(command.replyTransform).toBeUndefined();
	});
});

describe('returns', () => {
	test('number', async () => {
		const result = await redisXClient.HSET(createRandomKey(), 'foo', '1');
		expect(result).toBe(1);
	});
});
