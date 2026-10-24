import { createClient } from 'redis';
import { expect, test } from 'vitest';
import { redisClient, redisXClient } from '../test/client.js';
import { getRedisXClient, RedisXClient } from './main.js';

test('returns the same RedisXClient for the same redis client', () => {
	const client = getRedisXClient(redisClient);

	expect(client).toBeInstanceOf(RedisXClient);
	expect(client['~redisClient']).toBe(redisClient);
	expect(getRedisXClient(redisClient)).toBe(client);
});

test('wraps different redis clients separately', () => {
	expect(getRedisXClient(createClient())).not.toBe(
		getRedisXClient(redisClient),
	);
});

test('returns a RedisXClient as is', () => {
	expect(getRedisXClient(redisXClient)).toBe(redisXClient);
});

test('returns a RedisXClient from another package copy as is', () => {
	const foreign = {
		'~x': Symbol.for('@redis-x/client'),
	} as unknown as RedisXClient;

	expect(redisXClient['~x']).toBe(Symbol.for('@redis-x/client'));
	expect(getRedisXClient(foreign)).toBe(foreign);
});
