import { type UnwrapRedisXTransactionCommand } from './transaction/command.js';
import { RedisXTransactionUse } from './transaction/use.js';
import type { Awaitable, RedisClient } from './types.js';
type AddToList<T, U> = T extends any[] ? [...T, U] : [U];
type GetLast<L> = L extends [...any[], infer T] ? T : never;
export declare class RedisXTransaction<L = [], C extends boolean = false, D = unknown> {
    private multi;
    private promise;
    private queue_length;
    private transformers;
    private return_no_array;
    private data;
    constructor(redisClient: RedisClient);
    addCommand(command: string, ...args: (string | number)[]): RedisXTransaction<AddToList<L, unknown>, C, D>;
    /**
     * Addes command to MULTI queue.
     * @param command -
     */
    private queueCommand;
    private useCommand;
    as<const K extends string>(key: K): RedisXTransaction<L, C, { [P in keyof D | K]: K extends P ? GetLast<L> : P extends keyof D ? D[P] : never; }>;
    use<const CB extends (transaction: RedisXTransactionUse) => Awaitable<Record<string, any> | void>>(callback: CB): RedisXTransaction<[], true, Awaited<ReturnType<CB>> extends Record<string, any> ? UnwrapRedisXTransactionCommand<Awaited<ReturnType<CB>>> & D : D>;
    execute(): Promise<unknown extends D ? unknown extends (C extends true ? unknown : L extends [] ? unknown : L) ? Record<string, never> : C extends true ? unknown : L extends [] ? unknown : L : (C extends true ? unknown : L extends [] ? unknown : L) & { [K in keyof D]: D[K]; }>;
    /**
     * Get the value of key.
     *
     * If the key does not exist `null` is returned.
     *
     * An error is returned if the value stored at key is not a string, because GET only handles string values.
     * - Available since: 1.0.0.
     * - Time complexity: O(1).
     * @param key Key to get.
     * @returns The value of key, or `null` when key does not exist.
     */
    GET(key: string): RedisXTransaction<AddToList<L, string | null>, C, D>;
    /**
     * Set the string value of a key.
     * - Available since: 1.0.0.
     * - Time complexity: O(1).
     * @param key Key to set.
     * @param value Value to set.
     * @returns Returns string `"OK"` if the key was set, or `null` if operation was aborted (conflict with one of the XX/NX options).
     */
    SET(key: string, value: string | number): RedisXTransaction<AddToList<L, 'OK' | null>, C, D>;
    /**
     * Set the string value of a key.
     * - Available since: 1.0.0.
     * - Time complexity: O(1).
     * @param key Key to set.
     * @param value Value to set.
     * @param options Comand options.
     * @returns Returns string `"OK"` if the key was set, or `null` if operation was aborted (conflict with one of the XX/NX options).
     */
    SET(key: string, value: string | number, options: Omit<SetOptions, 'GET'>): RedisXTransaction<AddToList<L, 'OK' | null>, C, D>;
    /**
     * Set the string value of a key.
     * - Available since: 1.0.0.
     * - Time complexity: O(1).
     * @param key Key to set.
     * @param value Value to set.
     * @param options Comand options.
     * @returns Returns string with the previous value of the key, or `null` if the key didn't exist before the SET.
     */
    SET(key: string, value: string | number, options: SetOptions): RedisXTransaction<AddToList<L, string | null>, C, D>;
    /**
     * Set a timeout on key.
     *
     * After the timeout has expired, the key will automatically be deleted.
     * - Available since: 1.0.0.
     * - Time complexity: O(1).
     * @param key Key to get.
     * @param seconds Time to live in seconds.
     * @param options Command options.
     * @returns Returns `1` if the timeout was set. Returns `0` if the timeout was not set; for example, the key doesn't exist, or the operation was skipped because of the provided arguments.
     */
    EXPIRE(key: string, seconds: number, options?: ExpireOptions): RedisXTransaction<AddToList<L, 0 | 1>, C, D>;
    /**
     * Returns all keys matching pattern.
     * - Available since: 1.0.0.
     * - Time complexity: O(N) with N being the number of keys in the database.
     * @param pattern Pattern to match.
     * @returns A set of keys matching pattern.
     */
    KEYS(pattern: string): RedisXTransaction<AddToList<L, Set<string>>, C, D>;
    /**
     * Removes the specified keys.
     *
     * A key is ignored if it does not exist.
     * - Available since: 1.0.0.
     * - Time complexity: O(N) where N is the number of keys that will be removed. When a key to remove holds a value other than a string, the individual complexity for this key is O(M) where M is the number of elements in the list, set, sorted set or hash.
     * @param keys Keys to delete.
     * @returns The number of keys that were removed.
     */
    DEL(...keys: string[]): RedisXTransaction<AddToList<L, number>, C, D>;
    /**
     * Insert all the specified elements at the head of the list stored at key.
     *
     * If key does not exist, it is created as empty list before performing the push operations.
     * - Available since: 1.0.0.
     * - Multiple field/value pairs are available since Redis 2.4.0.
     * - Time complexity: O(1) for each element added.
     * @param key -
     * @param elements -
     * @returns The length of the list after the push operation.
     */
    LPUSH(key: string, ...elements: (string | number)[]): RedisXTransaction<AddToList<L, number>, C, D>;
    /**
     * Returns the sorted set cardinality (number of elements) of the sorted set stored at key.
     * - Available since: 1.2.0.
     * - Time complexity: O(1).
     * @param key Key holds a sorted set.
     * @returns The cardinality (number of members) of the sorted set, or 0 if the key doesn't exist.
     */
    ZCARD(key: string): RedisXTransaction<AddToList<L, number>, C, D>;
    /**
     * Returns the score of member in the sorted set at key.
     * - Available since: 1.0.0.
     * - Time complexity: O(1).
     * @param key Key holds a sorted set.
     * @param member Member in the sorted set.
     * @returns The score of the member (a double-precision floating point number), represented as a string, or `null` if member does not exist in the sorted set, or the key does not exist.
     */
    ZSCORE(key: string, member: string | number): RedisXTransaction<AddToList<L, number | null>, C, D>;
    /**
     * Adds member with the specified score to the sorted set stored at key.
     * - Available since: 1.2.0
     * - Multiple score/member pairs are available since Redis 2.4.0.
     * - Time complexity: O(log(N)) for each item added, where N is the number of elements in the sorted set.
     * @param key - Key holds a sorted set.
     * @param score - Score associated with the member.
     * @param member - Member to add.
     * @param options -
     * @returns The number of fields that were added.
     */
    ZADD(key: string, score: number, member: string | number, options?: ZaddOptions): RedisXTransaction<AddToList<L, number>, C, D>;
    /**
     * Adds all the specified members with the specified scores to the sorted set stored at key.
     * - Available since: 1.2.0
     * - Multiple score/member pairs are available since Redis 2.4.0.
     * - Time complexity: O(log(N)) for each item added, where N is the number of elements in the sorted set.
     * @param key - Key holds a sorted set.
     * @param pairs - Object containing score/member pairs to set.
     * @param options -
     * @returns The number of fields that were added.
     */
    ZADD(key: string, pairs: Record<string, number>, options?: Omit<ZaddOptions, 'INCR'>): RedisXTransaction<AddToList<L, number>, C, D>;
    /**
     * Removes the specified members from the sorted set stored at key. Non existing members are ignored.
     * - Available since: 1.2.0
     * - Time complexity: O(M*log(N)) with N being the number of elements in the sorted set and M the number of elements to be removed.
     * @param key Key holds a sorted set.
     * @param members Members to remove.
     * @returns The number of members removed from the sorted set, not including non-existing members.
     */
    ZREM(key: string, ...members: (string | number)[]): RedisXTransaction<AddToList<L, number>, C, D>;
    /**
     * Removes the specified members from the sorted set stored at key. Non existing members are ignored.
     * - Available since: 1.2.0
     * - Time complexity: O(M*log(N)) with N being the number of elements in the sorted set and M the number of elements to be removed.
     * @param key Key holds a sorted set.
     * @param members Members to remove.
     * @returns The number of members removed from the sorted set, not including non-existing members.
     */
    ZREM(key: string, members: (string | number)[] | Set<string> | IterableIterator<string>): RedisXTransaction<AddToList<L, number>, C, D>;
    /**
     * Returns the specified range of elements in the sorted set stored at key.
     * - Available since: 1.2.0
     * - Time complexity: O(log(N)+M) with N being the number of elements in the sorted set and M the number of elements returned.
     * @param key - Key that contains the hash.
     * @param start - Start index by default, minimum score if BY is `SCORE` or minimum lexicographical string if BY is `LEX`.
     * @param stop - Stop index by default, minimum score if BY is `SCORE` or minimum lexicographical string if BY is `LEX`.
     * @param options -
     * @returns List of members in the specified range.
     */
    ZRANGE(key: string, start: string | number, stop: string | number, options?: Omit<ZrangeOptions, 'WITHSCORES'>): RedisXTransaction<AddToList<L, string[]>, C, D>;
    /**
     * Returns the specified range of elements in the sorted set stored at key.
     * - Available since: 1.2.0
     * - Time complexity: O(log(N)+M) with N being the number of elements in the sorted set and M the number of elements returned.
     * @param key - Key that contains the hash.
     * @param start - Start index by default, minimum score if BY is `SCORE` or minimum lexicographical string if BY is `LEX`.
     * @param stop - Stop index by default, minimum score if BY is `SCORE` or minimum lexicographical string if BY is `LEX`.
     * @param options -
     * @returns List of members in the specified range with their scores.
     */
    ZRANGE(key: string, start: string | number, stop: string | number, options: ZrangeOptions): RedisXTransaction<AddToList<L, {
        member: string;
        score: number;
    }[]>, C, D>;
    /**
     * Computes the intersection of sorted sets given by the specified keys, and stores the result in destination. It is mandatory to provide the number of input keys (numkeys) before passing the input keys and the other (optional) arguments.
     * - Available since: 2.0.0.
     * - Time complexity: O(N*K)+O(M*log(M)).
     * @param destination Destination key where the resulting sorted set should be stored.
     * @param keys List of keys that holds sorted sets.
     * @param options -
     * @returns The number of members in the resulting sorted set at the destination.
     */
    ZINTERSTORE(destination: string, keys: (string | number)[], options?: ZinterstoreOptions): RedisXTransaction<AddToList<L, number>, C, D>;
    /**
     * Computes the intersection of sorted sets given by the specified keys, and stores the result in destination. It is mandatory to provide the number of input keys (numkeys) before passing the input keys and the other (optional) arguments.
     * - Available since: 2.0.0.
     * - Time complexity: O(N*K)+O(M*log(M)).
     * @param destination Destination key where the resulting sorted set should be stored.
     * @param keys_with_weights Record where keys are the keys that holds sorted sets and values are the weights to apply to the sorted sets.
     * @param options -
     * @returns The number of members in the resulting sorted set at the destination.
     */
    ZINTERSTORE(destination: string, keys_with_weights: Record<string, number>, options?: ZinterstoreOptions): RedisXTransaction<AddToList<L, number>, C, D>;
    /**
     * Sets the specified fields to their respective values in the hash stored at key.
     * - Available since: 2.0.0.
     * - Multiple field/value pairs are available since Redis 4.0.0.
     * - Time complexity: O(1) for each field/value pair added.
     * @param key Key that contains the hash.
     * @param field Field to set.
     * @param value Value to set.
     * @returns The number of fields that were added.
     */
    HSET(key: string, field: string, value: string | number): RedisXTransaction<AddToList<L, number>, C, D>;
    /**
     * Sets the specified fields to their respective values in the hash stored at key.
     * - Available since: 2.0.0.
     * - Multiple field/value pairs are available since Redis 4.0.0.
     * - Time complexity: O(1) for each field/value pair added.
     * @param key Key that contains the hash.
     * @param pairs Object containing field/value pairs to set.
     * @returns The number of fields that were added.
     */
    HSET(key: string, pairs: Record<string, string | number>): RedisXTransaction<AddToList<L, number>, C, D>;
    /**
     * Returns all fields and values of the hash stored at key.
     * - Available since: 2.0.0.
     * - Time complexity: O(N) where N is the size of the hash.
     * @param key -
     * @returns A record of fields and their values stored in the hash.
     */
    HGETALL(key: string): RedisXTransaction<AddToList<L, Record<string, string>>, C, D>;
    /**
     * Invoke the execution of a server-side Lua script.
     * - Available since: 2.6.0.
     * - Time complexity: Depends on the script that is executed.
     * @param script Script's source code.
     * @param keys Keys accessed by the script.
     * @param args Arguments passed to the script.
     * @returns Value returned by the script.
     */
    EVAL(script: string, keys: (string | number)[], args?: (string | number)[]): RedisXTransaction<AddToList<L, unknown>, C, D>;
}
import { type SetOptions } from './commands/string/set.js';
import { type ExpireOptions } from './commands/generic/expire.js';
import { type ZaddOptions } from './commands/sorted-set/zadd.js';
import { type ZrangeOptions } from './commands/sorted-set/zrange.js';
import { type ZinterstoreOptions } from './commands/sorted-set/zinterstore.js';
export {};
