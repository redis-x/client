import type {
	RedisClientType,
	RedisFunctions,
	RedisModules,
	RedisScripts,
} from 'redis';

export type RedisClient = RedisClientType<RedisModules, RedisFunctions, RedisScripts>;

export type Command<T = unknown> = {
	kind: '#schema',
	args: string[],
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	replyTransform?: (result: any) => T,
};
