import {
	describe,
	expect,
	test,
} from 'vitest';
import { redisXClient } from '../../../test/client.js';
import { createRandomKey } from '../../../test/utils.js';
import { input } from './get.js';

test('command', () => {
	const command = input('key');

	expect(
		command.args,
	).toStrictEqual(
		[ 'GET', 'key' ],
	);

	expect(command.replyTransform).toBeUndefined();
});

describe('returns', () => {
	test('string', async () => {
		const key = createRandomKey();

		await redisXClient.sendCommand('SET', key, 'value');

		const result = await redisXClient.GET(key);
		expect(result).toBe('value');
	});

	test('null', async () => {
		const result = await redisXClient.GET(createRandomKey());
		expect(result).toBe(null);
	});
});
