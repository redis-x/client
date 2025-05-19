import {
	beforeEach,
	describe,
	test,
	expect,
} from 'vitest';
import { redisXClient } from '../../../test/client.js';
import { createRandomKey } from '../../../test/utils.js';
import { input } from './keys.js';

test('command', () => {
	const command = input('foo*');

	expect(command.args).toStrictEqual(
		[ 'KEYS', 'foo*' ],
	);

	expect(
		command.replyTransform?.([ 'foo1', 'foo2' ]),
	).toStrictEqual(
		new Set([ 'foo1', 'foo2' ]),
	);
});

describe('returns', () => {
	beforeEach(async () => {
		await redisXClient.sendCommand('FLUSHDB');
	});

	test('Set', async () => {
		const keys = new Set([
			createRandomKey(),
			createRandomKey(),
			createRandomKey(),
		]);

		await redisXClient.sendCommand('MSET', ...[ ...keys.entries() ].flat());

		const result = await redisXClient.KEYS('*');

		expect(result.size).toBe(keys.size);
		expect(result).toStrictEqual(keys);
	});
});
