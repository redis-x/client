/* eslint-disable @stylistic/array-element-newline */

import {
	describe,
	expect,
	test,
	beforeEach,
} from 'vitest';
import { redisXClient } from '../../../test/client.js';
import { createRandomKey } from '../../../test/utils.js';
import { input } from './exists.js';

test('command', () => {
	const command = input('key1', 'key2');
	expect(
		command.args,
	).toStrictEqual(
		[ 'EXISTS', 'key1', 'key2' ],
	);

	expect(command.replyTransform).toBeUndefined();
});

describe('returns', () => {
	beforeEach(async () => {
		await redisXClient.sendCommand('FLUSHDB');
	});

	test('number', async () => {
		const existingKey = createRandomKey();
		const nonExistingKey = createRandomKey();

		await redisXClient.sendCommand('SET', existingKey, 'value');

		const result = await redisXClient.EXISTS(existingKey, nonExistingKey);
		expect(result).toBe(1);

		const resultMultiple = await redisXClient.EXISTS(existingKey, existingKey, nonExistingKey);
		expect(resultMultiple).toBe(2);
	});
});
