import { REDIS_X_CLIENT_SYMBOL, RedisXClient } from './client.js';
import type { RedisClient } from './types.js';

const REDIS_X_CLIENTS = new WeakMap<RedisClient, RedisXClient>();

/**
 * Checks for the RedisX client marker, so a RedisXClient from another package copy is recognized too.
 * @param client Client from the `redis` package or a RedisX client.
 * @returns Whether the client is a RedisX client.
 */
function isRedisXClient(
	client: RedisClient | RedisXClient,
): client is RedisXClient {
	return (client as { '~x'?: unknown })['~x'] === REDIS_X_CLIENT_SYMBOL;
}

/**
 * Returns a `RedisXClient` instance for the given `RedisClient`.
 *
 * If `RedisXClient` instance already exists for that given `RedisClient`, it is returned from the cache, not created anew.
 * A `RedisXClient` is returned as is.
 */
export function getRedisXClient(
	redisClient: RedisClient | RedisXClient,
): RedisXClient {
	if (isRedisXClient(redisClient)) {
		return redisClient;
	}

	if (REDIS_X_CLIENTS.has(redisClient)) {
		return REDIS_X_CLIENTS.get(redisClient)!;
	}

	const client = new RedisXClient(redisClient);
	REDIS_X_CLIENTS.set(redisClient, client);
	return client;
}
