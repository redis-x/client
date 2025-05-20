import {
	describe,
	expect,
	test,
	beforeEach,
} from 'vitest';
import { redisXClient } from '../../../test/client.js';
import { createRandomKey } from '../../../test/utils.js';
import { input } from './expiretime.js';

test('command', () => {
	const command = input('key1');
	expect(
		command.args,
	).toStrictEqual(
		[ 'EXPIRETIME', 'key1' ],
	);

	expect(command.replyTransform).toBeUndefined();
});

describe('returns', () => {
	beforeEach(async () => {
		await redisXClient.sendCommand('FLUSHDB');
	});

	test('expiration timestamp', async () => {
		const existingKey = createRandomKey();
		const nonExistingKey = createRandomKey();
		const noExpirationKey = createRandomKey();

		// Set key with expiration time
		const timestamp = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
		await redisXClient.createTransaction()
			.addCommand('SET', existingKey, 'value')
			.addCommand('EXPIREAT', existingKey, String(timestamp))
			// Set key with no expiration
			.addCommand('SET', noExpirationKey, 'value')
			.execute();

		// Check EXPIRETIME results
		const resultWithExpiry = await redisXClient.EXPIRETIME(existingKey);
		expect(resultWithExpiry).toBe(timestamp);

		const resultNonExisting = await redisXClient.EXPIRETIME(nonExistingKey);
		expect(resultNonExisting).toBe(-2);

		const resultNoExpiry = await redisXClient.EXPIRETIME(noExpirationKey);
		expect(resultNoExpiry).toBe(-1);
	});
});
