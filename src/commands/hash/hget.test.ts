import {
	describe,
	expect,
	test,
} from 'vitest';
import { redisXClient } from '../../../test/client.js';
import { createRandomKey } from '../../../test/utils.js';
import { input } from './hget.js';

test('command', () => {
	const command = input('key', 'field');

	expect(command.args).toStrictEqual(
		[
			'HGET',
			'key',
			'field',
		],
	);
});

describe('returns', () => {
	test('object', async () => {
		const key = createRandomKey();

		await redisXClient.sendCommand('HSET', key, 'key1', 'value1', 'key2', 'value2');

		const result = await redisXClient.HGET(key, 'key1');
		expect(result).toStrictEqual('value1');

		expect(
			await redisXClient.HGET(
				createRandomKey(),
				createRandomKey(),
			),
		).toStrictEqual(null);
	});
});
