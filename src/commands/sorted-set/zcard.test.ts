import {
	describe,
	expect,
	test,
} from 'vitest';
import { redisXClient } from '../../../test/client.js';
import { createRandomKey } from '../../../test/utils.js';
import { input } from './zcard.js';

test('command', () => {
	const command = input('key');

	expect(
		command.args,
	).toStrictEqual(
		[ 'ZCARD', 'key' ],
	);

	expect(command.replyTransform).toBeUndefined();
});

describe('returns', () => {
	test('number', async () => {
		const key = createRandomKey();

		await redisXClient.sendCommand('ZADD', key, 1, 'foo', 2, 'bar');

		const result = await redisXClient.ZCARD(key);
		expect(result).toBe(2);
	});
});
