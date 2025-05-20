import {
	describe,
	expect,
	test,
	beforeEach,
} from 'vitest';
import { redisXClient } from '../../../test/client.js';
import { createRandomKey } from '../../../test/utils.js';
import { input } from './persist.js';

test('command', () => {
	const command = input('key1');
	expect(
		command.args,
	).toStrictEqual(
		[ 'PERSIST', 'key1' ],
	);

	expect(
		command.replyTransform?.(0),
	).toStrictEqual(false);

	expect(
		command.replyTransform?.(1),
	).toStrictEqual(true);
});

describe('returns', () => {
	beforeEach(async () => {
		await redisXClient.sendCommand('FLUSHDB');
	});

	test('persist values', async () => {
		const existingKey = createRandomKey();
		const nonExistingKey = createRandomKey();
		const noExpirationKey = createRandomKey();

		// Set key with expiration time
		await redisXClient.createTransaction()
			.addCommand('SET', existingKey, 'value', 'EX', '3600')
			// Set key with no expiration
			.addCommand('SET', noExpirationKey, 'value')
			.execute();

		// Check PERSIST results
		// Should remove timeout and return true
		const resultWithExpiry = await redisXClient.PERSIST(existingKey);
		expect(resultWithExpiry).toBe(true);

		// Should return false for non-existing key
		const resultNonExisting = await redisXClient.PERSIST(nonExistingKey);
		expect(resultNonExisting).toBe(false);

		// Should return false for key with no expiration
		const resultNoExpiry = await redisXClient.PERSIST(noExpirationKey);
		expect(resultNoExpiry).toBe(false);
	});
});
