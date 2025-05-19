import { RedisClientType, RedisFunctions, RedisModules, RedisScripts } from 'redis';
export type RedisClient = RedisClientType<RedisModules, RedisFunctions, RedisScripts>;
export type Command<T = unknown> = {
    kind: '#schema';
    args: string[];
    replyTransform?: (result: any) => T;
};
export type Awaitable<T> = T | Promise<T>;
