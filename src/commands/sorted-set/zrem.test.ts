import {
	describe,
	expect,
	test,
} from 'vitest';
import { redisXClient } from '../../../test/client.js';
import { createRandomKey } from '../../../test/utils.js';
import { input } from './zrem.js';

describe('command', () => {
	test('single member', () => {
		const command = input('key', 'member');

		expect(
			command.args,
		).toStrictEqual([
			'ZREM',
			'key',
			'member',
		]);

		expect(command.replyTransform).toBeUndefined();
	});

	test('multi members', () => {
		const command = input('key', 'member1', 'member2', 'member3');

		expect(
			command.args,
		).toStrictEqual([
			'ZREM',
			'key',
			'member1',
			'member2',
			'member3',
		]);
	});

	test('set members', () => {
		const command = input('key', new Set([ 'member1', 'member2' ]));

		expect(
			command.args,
		).toStrictEqual([
			'ZREM',
			'key',
			'member1',
			'member2',
		]);
	});
});

describe('returns', () => {
	test('number', async () => {
		const key = createRandomKey();

		await redisXClient.sendCommand('ZADD', key, 1, 'foo');

		const result = await redisXClient.ZREM(key, 'foo', 'bar');
		expect(result).toBe(1);
	});
});
