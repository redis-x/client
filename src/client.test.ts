import {
	expect,
	test,
} from 'vitest';
import { redisXClient } from '../test/client.js';
import { createRandomKey } from '../test/utils.js';

const key_hash = createRandomKey();

test('unknown command', async () => {
	const result = await redisXClient.sendCommand('HSET', key_hash, 'foo', '1', 'baz', '2');

	expect(result).toBe(2);
});

test('command with no transformer', async () => {
	const result = await redisXClient.GET(createRandomKey());

	expect(result).toBe(null);
});

test('command with transformer', async () => {
	const result = await redisXClient.HGETALL(key_hash);

	expect(result).toStrictEqual({
		foo: '1',
		baz: '2',
	});
});
