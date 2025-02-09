import {
	describe,
	expect,
	test,
} from 'vitest';
import { redisXClient } from '../../../test/client.js';
import { createRandomKey } from '../../../test/utils.js';
import { input } from './hgetall.js';

test('command', () => {
	const command = input('key');

	expect(command.args).toStrictEqual(
		[ 'HGETALL', 'key' ],
	);

	expect(
		command.replyTransform!([
			'key1',
			'value1',
			'key2',
			'value2',
		]),
	).toStrictEqual({
		key1: 'value1',
		key2: 'value2',
	});
});

describe('returns', () => {
	test('object', async () => {
		const key = createRandomKey();

		await redisXClient.sendCommand('HSET', key, 'key1', 'value1', 'key2', 'value2');

		const result = await redisXClient.HGETALL(key);
		expect(result).toStrictEqual({
			key1: 'value1',
			key2: 'value2',
		});
	});
});
