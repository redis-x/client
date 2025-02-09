import {
	describe,
	expect,
	test,
} from 'vitest';
import { redisXClient } from '../../../test/client.js';
import { createRandomKey } from '../../../test/utils.js';
import { input } from './zscore.js';

test('command', () => {
	const command = input('key', 'member');

	expect(
		command.args,
	).toStrictEqual(
		[
			'ZSCORE',
			'key',
			'member',
		],
	);

	expect(command.replyTransform!('1')).toStrictEqual(1);
	expect(command.replyTransform!(null)).toBeNull();
});

describe('returns', () => {
	test('number', async () => {
		const key = createRandomKey();

		await redisXClient.sendCommand('ZADD', key, 1, 'foo');

		const result = await redisXClient.ZSCORE(key, 'foo');
		expect(result).toBe(1);
	});

	test('null', async () => {
		const key = createRandomKey();

		const result = await redisXClient.ZSCORE(key, 'foo');
		expect(result).toBe(null);
	});
});
