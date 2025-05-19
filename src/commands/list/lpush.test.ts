import {
	describe,
	expect,
	test,
} from 'vitest';
import { redisXClient } from '../../../test/client.js';
import { createRandomKey } from '../../../test/utils.js';
import { input } from './lpush.js';

test('command', () => {
	const command = input('key', 'apple', 'banana');

	expect(command.args).toStrictEqual([
		'LPUSH',
		'key',
		'apple',
		'banana',
	]);

	expect(command.replyTransform).toBeUndefined();
});

describe('returns', () => {
	test('number', async () => {
		const key = createRandomKey();

		const result = await redisXClient.LPUSH(key, 'apple', 'banana');
		expect(result).toBe(2);
	});
});
