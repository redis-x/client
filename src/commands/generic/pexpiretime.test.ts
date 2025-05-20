import {
	describe,
	expect,
	test,
	beforeEach,
} from 'vitest';
import { redisXClient } from '../../../test/client.js';
import { createRandomKey } from '../../../test/utils.js';
import { input } from './pexpiretime.js';

test('command', () => {
	const command = input('key1');
	expect(
		command.args,
	).toStrictEqual(
		[ 'PEXPIRETIME', 'key1' ],
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
		const timestamp = Date.now() + 3_600_000; // 1 hour from now
		await redisXClient.createTransaction()
			.addCommand('SET', existingKey, 'value', 'PXAT', String(timestamp))
			// Set key with no expiration
			.addCommand('SET', noExpirationKey, 'value')
			.execute();

		// Check EXPIRETIME results
		const resultWithExpiry = await redisXClient.PEXPIRETIME(existingKey);
		expect(resultWithExpiry).toBe(timestamp);

		const resultNonExisting = await redisXClient.PEXPIRETIME(nonExistingKey);
		expect(resultNonExisting).toBe(-2);

		const resultNoExpiry = await redisXClient.PEXPIRETIME(noExpirationKey);
		expect(resultNoExpiry).toBe(-1);
	});
});
