import { Promisable } from "type-fest";
import { RedisClientType, RedisFunctions, RedisModules, RedisScripts } from "redis";

//#region src/transaction/command.d.ts
declare class RedisXTransactionCommand<T> {
  index: number;
  private _type;
  constructor(index: number);
}
type UnwrapRedisXTransactionCommand<T> = T extends RedisXTransactionCommand<infer A> ? A : T extends (infer U)[] ? UnwrapRedisXTransactionCommand<U>[] : T extends Record<string, any> ? { [K in keyof T]: UnwrapRedisXTransactionCommand<T[K]> } : T;

//#endregion
//#region src/types.d.ts
/**
* Recursively walks through the object and unwraps all RedisTransactionCommand instances.
* @param target Value to unwrap.
* @param result Result of the transaction.
* @returns The unwrapped value.
*/
type RedisClient = RedisClientType<RedisModules, RedisFunctions, RedisScripts>;
type Command<T = unknown> = {
  kind: "#schema";
  args: string[];
  replyTransform?: (result: any) => T;
};

//#endregion
//#region src/commands/string/set.d.ts
type SetOptions = {
  /**
  * Only set the key if it does not already exist.
  * - Incompatible with option `XX`.
  * - Incompatible with option `GET` before 7.0.0.
  * - Available since: 2.6.12.
  */
  NX?: boolean;
  /**
  * Only set the key if it already exist.
  * - Incompatible with option `NX`.
  * - Available since: 2.6.12.
  */
  XX?: boolean;
  /**
  * Set the specified expire time, in *seconds*.
  * - Incompatible with options `PX`, `EXAT`, `PXAT` and `KEEPTTL`.
  * - Available since: 2.6.12.
  */
  EX?: number;
  /**
  * Set the specified expire time, in *milliseconds*.
  * - Incompatible with options `EX`, `EXAT`, `PXAT` and `KEEPTTL`.
  * - Available since: 2.6.12.
  */
  PX?: number;
  /**
  * Set the specified expire time, in *seconds*.
  * - Incompatible with options `EX`, `PX`, `PXAT` and `KEEPTTL`.
  * - Available since: 6.2.0.
  */
  EXAT?: number;
  /**
  * Set the specified expire time, in *milliseconds*.
  * - Incompatible with options `EX`, `PX`, `EXAT` and `KEEPTTL`.
  * - Available since: 6.2.0.
  */
  PXAT?: number;
  /**
  * Retain the time to live associated with the key.
  * - Incompatible with options `EX`, `PX`, `EXAT` and `PXAT`.
  * - Available since: 6.0.0.
  */
  KEEPTTL?: boolean;
};
type SetOptionsGet = {
  /**
  * Get the value of the key before the SET operation.
  * - Incompatible with option `NX` before 7.0.0.
  * - Available since: 6.2.0.
  */
  GET: true;
}; //#endregion
//#region src/commands/generic/pexpire.d.ts
type PexpireOptions = {
  /**
  * Set expiry only when the key has no expiry.
  * - Incompatible with options `XX`, `GT` and `LT`.
  * - Available since: 7.0.0.
  * @type {boolean}
  */
  NX?: boolean;
  /**
  * Set expiry only when the key has an existing expiry.
  * - Incompatible with options `NX`, `GT` and `LT`.
  * - Available since: 7.0.0.
  * @type {boolean}
  */
  XX?: boolean;
  /**
  * Set expiry only when the new expiry is greater than current one. A non-volatile key is treated as an infinite TTL.
  * - Incompatible with options `NX`, `XX` and `LT`.
  * - Available since: 7.0.0.
  * @type {boolean}
  */
  GT?: boolean;
  /**
  * Set expiry only when the new expiry is less than current one. A non-volatile key is treated as an infinite TTL.
  * - Incompatible with options `NX`, `XX` and `GT`.
  * - Available since: 7.0.0.
  * @type {boolean}
  */
  LT?: boolean;
};

//#endregion
//#region src/commands/generic/expire.d.ts
/**
* This command works exactly like EXPIRE but the time to live of the key is specified in milliseconds instead of seconds.
* - Available since: 2.6.0.
* - Time complexity: O(1).
* @param key Key to set the timeout on.
* @param seconds Time to live in milliseconds.
* @param options Command options.
* @returns Returns `true` if the timeout was set. Returns `false` if the timeout was not set; for example, the key doesn't exist, or the operation was skipped because of the provided arguments.
* @see {@link https://redis.io/commands/pexpire}
* @see {@link https://redis.io/commands/expire}
*/
type ExpireOptions = {
  /**
  * Set expiry only when the key has no expiry.
  * - Incompatible with options `XX`, `GT` and `LT`.
  * - Available since: 7.0.0.
  * @type {boolean}
  */
  NX?: boolean;
  /**
  * Set expiry only when the key has an existing expiry.
  * - Incompatible with options `NX`, `GT` and `LT`.
  * - Available since: 7.0.0.
  * @type {boolean}
  */
  XX?: boolean;
  /**
  * Set expiry only when the new expiry is greater than current one. A non-volatile key is treated as an infinite TTL.
  * - Incompatible with options `NX`, `XX` and `LT`.
  * - Available since: 7.0.0.
  * @type {boolean}
  */
  GT?: boolean;
  /**
  * Set expiry only when the new expiry is less than current one. A non-volatile key is treated as an infinite TTL.
  * - Incompatible with options `NX`, `XX` and `GT`.
  * - Available since: 7.0.0.
  * @type {boolean}
  */
  LT?: boolean;
};

//#endregion
//#region src/commands/generic/copy.d.ts
/**
* Set a timeout on key.
*
* After the timeout has expired, the key will automatically be deleted.
* - Available since: 1.0.0.
* - Time complexity: O(1).
* @param key Key to set the timeout on.
* @param seconds Time to live in seconds.
* @param options Command options.
* @returns Returns `true` if the timeout was set. Returns `false` if the timeout was not set; for example, the key doesn't exist, or the operation was skipped because of the provided arguments.
* @see {@link https://redis.io/commands/expire}
*/
type CopyOptions = {
  /**
  * Logical database index for the destination key.
  * - Available since: 6.2.0.
  */
  DB?: number;
  /**
  * If true, will replace the destination key if it already exists.
  * - Available since: 6.2.0.
  */
  REPLACE?: boolean;
};

//#endregion
//#region src/commands/generic/expireat.d.ts
/**
* Copy the value stored at the source key to the destination key.
* - Available since: 6.2.0.
* - Time complexity: O(N) worst case for collections, where N is the number of nested items. O(1) for string values.
* @param source The source key.
* @param destination The destination key.
* @param options Command options.
* @returns Whether the copy was successful.
* @see {@link https://redis.io/commands/copy}
*/
type ExpireatOptions = {
  /**
  * Set expiry only when the key has no expiry.
  * - Incompatible with options `XX`, `GT` and `LT`.
  * - Available since: 7.0.0.
  * @type {boolean}
  */
  NX?: boolean;
  /**
  * Set expiry only when the key has an existing expiry.
  * - Incompatible with options `NX`, `GT` and `LT`.
  * - Available since: 7.0.0.
  * @type {boolean}
  */
  XX?: boolean;
  /**
  * Set expiry only when the new expiry is greater than current one. A non-volatile key is treated as an infinite TTL.
  * - Incompatible with options `NX`, `XX` and `LT`.
  * - Available since: 7.0.0.
  * @type {boolean}
  */
  GT?: boolean;
  /**
  * Set expiry only when the new expiry is less than current one. A non-volatile key is treated as an infinite TTL.
  * - Incompatible with options `NX`, `XX` and `GT`.
  * - Available since: 7.0.0.
  * @type {boolean}
  */
  LT?: boolean;
};

//#endregion
//#region src/commands/generic/pexpireat.d.ts
/**
* This command has the same effect and semantic as EXPIRE, but instead of specifying the number of seconds representing the TTL (time to live), it takes an absolute Unix timestamp (seconds since January 1, 1970).
*
* A timestamp in the past will delete the key immediately.
* - Available since: 1.2.0.
* - Time complexity: O(1).
* @param key Key to set the timeout on.
* @param timestamp Unix timestamp in seconds.
* @param options Command options.
* @returns Returns `true` if the timeout was set. Returns `false` if the timeout was not set; for example, the key doesn't exist, or the operation was skipped because of the provided arguments.
* @see {@link https://redis.io/commands/expireat}
* @see {@link https://redis.io/commands/expire}
*/
type PexpireatOptions = {
  /**
  * Set expiry only when the key has no expiry.
  * - Incompatible with options `XX`, `GT` and `LT`.
  * - Available since: 7.0.0.
  * @type {boolean}
  */
  NX?: boolean;
  /**
  * Set expiry only when the key has an existing expiry.
  * - Incompatible with options `NX`, `GT` and `LT`.
  * - Available since: 7.0.0.
  * @type {boolean}
  */
  XX?: boolean;
  /**
  * Set expiry only when the new expiry is greater than current one. A non-volatile key is treated as an infinite TTL.
  * - Incompatible with options `NX`, `XX` and `LT`.
  * - Available since: 7.0.0.
  * @type {boolean}
  */
  GT?: boolean;
  /**
  * Set expiry only when the new expiry is less than current one. A non-volatile key is treated as an infinite TTL.
  * - Incompatible with options `NX`, `XX` and `GT`.
  * - Available since: 7.0.0.
  * @type {boolean}
  */
  LT?: boolean;
};

//#endregion
//#region src/commands/sorted-set/zadd.d.ts
/**
* This command has the same effect and semantic as EXPIREAT, but the Unix time at which the key will expire is specified in milliseconds instead of seconds.
* - Available since: 2.6.0.
* - Time complexity: O(1).
* @param key Key to set the timeout on.
* @param timestamp Unix timestamp in milliseconds.
* @param options Command options.
* @returns Returns `true` if the timeout was set. Returns `false` if the timeout was not set; for example, the key doesn't exist, or the operation was skipped because of the provided arguments.
* @see {@link https://redis.io/commands/pexpireat}
* @see {@link https://redis.io/commands/expireat}
*/
type ZaddOptions = {
  /**
  * Only add new elements. Don't update already existing elements.
  * - Incompatible with option `XX`, `GT` and `LT`.
  * - Available since: 3.0.2.
  */
  NX?: boolean;
  /**
  * Only update elements that already exist. Don't add new elements.
  * - Incompatible with option `NX`, `GT` and `LT`.
  * - Available since: 3.0.2.
  */
  XX?: boolean;
  /**
  * Only update existing elements if the new score is greater than the current score. This flag doesn't prevent adding new elements.
  * - Incompatible with options `NX`, `XX` and `LT`.
  * - Available since: 6.2.0.
  */
  GT?: boolean;
  /**
  * Only update existing elements if the new score is less than the current score. This flag doesn't prevent adding new elements.
  * - Incompatible with option `NX`, `XX` and `GT`.
  * - Available since: 6.2.0.
  */
  LT?: boolean;
  /**
  * Modify the return value from the number of new elements added, to the total number of elements changed.
  * - Available since: 3.0.2.
  */
  CH?: boolean;
  /**
  * When this option is specified ZADD acts like ZINCRBY. Only one score-element pair can be specified in this mode.
  * - Available since: 3.0.2.
  */
  INCR?: boolean;
};

//#endregion
//#region src/commands/sorted-set/zrange.d.ts
type ZrangeOptions = {
  /**
  * Returns the range of elements from the sorted set having scores equal or between `<start>` and `<stop>`.
  * - Available since: 6.2.0.
  */
  BY?: "SCORE" | "LEX";
  /**
  * Reverses the ordering, so elements are ordered from highest to lowest score, and score ties are resolved by reverse lexicographical ordering.
  * - Available since: 6.2.0.
  */
  REV?: boolean;
  /**
  * Obtains a sub-range from the matching elements (similar to SELECT LIMIT offset, count in SQL). A negative `<count>` returns all elements from the `<offset>`.
  * - Available since: 6.2.0.
  */
  LIMIT?: [number, number];
  /**
  * Supplements the command's reply with the scores of elements returned.
  */
  WITHSCORES?: true;
};

//#endregion
//#region src/commands/sorted-set/zinterstore.d.ts
type ZinterstoreOptions = {
  /**
  * Specifies how the results of the intersection are aggregated.
  *
  * This option defaults to `SUM`, where the score of an element is summed across the inputs where it exists.
  *
  * When this option is set to either `MIN` or `MAX`, the resulting set will contain the minimum or maximum score of an element across the inputs where it exists.
  */
  AGGREGATE?: "SUM" | "MIN" | "MAX";
};

//#endregion
//#region src/transaction/use.d.ts
declare class RedisXTransactionUse {
  private transaction;
  queue: {
    command: Command;
    redis_transaction_command: RedisXTransactionCommand<any>;
  }[];
  constructor(transaction: RedisXTransaction<any, any, any>);
  addCommand(command: string, ...args: (string | number)[]): RedisXTransactionCommand<unknown>;
  private useCommand;
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
  * @see {@link https://redis.io/commands/get}
  */
  GET(key: string): RedisXTransactionCommand<string | null>;
  /**
  * Set the string value of a key.
  * - Available since: 1.0.0.
  * - Time complexity: O(1).
  * @param key Key to set.
  * @param value Value to set.
  * @returns Returns string `"OK"` if the key was set, or `null` if operation was aborted (conflict with one of the XX/NX options).
  * @see {@link https://redis.io/commands/set}
  */
  SET(key: string, value: string | number): RedisXTransactionCommand<"OK" | null>;
  /**
  * Set the string value of a key.
  * - Available since: 1.0.0.
  * - Time complexity: O(1).
  * @param key Key to set.
  * @param value Value to set.
  * @param options Command options.
  * @returns Returns string `"OK"` if the key was set, or `null` if operation was aborted (conflict with one of the XX/NX options).
  * @see {@link https://redis.io/commands/set}
  */
  SET(key: string, value: string | number, options: SetOptions): RedisXTransactionCommand<"OK" | null>;
  /**
  * Set the string value of a key.
  * - Available since: 1.0.0.
  * - Time complexity: O(1).
  * @param key Key to set.
  * @param value Value to set.
  * @param options Command options.
  * @returns Returns string with the previous value of the key, or `null` if the key didn't exist before the SET.
  * @see {@link https://redis.io/commands/set}
  */
  SET(key: string, value: string | number, options: SetOptions & SetOptionsGet): RedisXTransactionCommand<string | null>;
  /**
  * This command works exactly like EXPIRE but the time to live of the key is specified in milliseconds instead of seconds.
  * - Available since: 2.6.0.
  * - Time complexity: O(1).
  * @param key Key to set the timeout on.
  * @param seconds Time to live in milliseconds.
  * @param options Command options.
  * @returns Returns `true` if the timeout was set. Returns `false` if the timeout was not set; for example, the key doesn't exist, or the operation was skipped because of the provided arguments.
  * @see {@link https://redis.io/commands/pexpire}
  * @see {@link https://redis.io/commands/expire}
  */
  PEXPIRE(key: string, seconds: number, options?: PexpireOptions): RedisXTransactionCommand<boolean>;
  /**
  * Returns the remaining time to live of a key that has a timeout, in milliseconds.
  *
  * Like TTL this command returns the remaining time to live of a key that has an
  * expire set, with the sole difference that TTL returns the amount of remaining
  * time in seconds while PTTL returns it in milliseconds.
  *
  * - Available since: 2.6.0.
  * - Time complexity: O(1).
  * @param key The key to check.
  * @returns One of the following:
  * - A positive integer: TTL in milliseconds.
  * - `-1`: if the key exists but has no associated expiration.
  * - `-2`: if the key does not exist.
  * @see {@link https://redis.io/commands/pttl}
  * @see {@link https://redis.io/commands/ttl}
  */
  PTTL(key: string): RedisXTransactionCommand<number>;
  /**
  * Returns the remaining time to live of a key that has a timeout.
  *
  * This introspection capability allows a Redis client to check how many seconds
  * a given key will continue to be part of the dataset.
  *
  * - Available since: 1.0.0.
  * - Time complexity: O(1).
  * @param key The key to check.
  * @returns One of the following:
  * - A positive integer: TTL in seconds.
  * - `-1`: if the key exists but has no associated expiration.
  * - `-2`: if the key does not exist.
  * @see {@link https://redis.io/commands/ttl}
  */
  TTL(key: string): RedisXTransactionCommand<number>;
  /**
  * Set a timeout on key.
  *
  * After the timeout has expired, the key will automatically be deleted.
  * - Available since: 1.0.0.
  * - Time complexity: O(1).
  * @param key Key to set the timeout on.
  * @param seconds Time to live in seconds.
  * @param options Command options.
  * @returns Returns `true` if the timeout was set. Returns `false` if the timeout was not set; for example, the key doesn't exist, or the operation was skipped because of the provided arguments.
  * @see {@link https://redis.io/commands/expire}
  */
  EXPIRE(key: string, seconds: number, options?: ExpireOptions): RedisXTransactionCommand<boolean>;
  /**
  * Returns the string representation of the type of the value stored at `key`.
  * - Available since: 1.0.0.
  * - Time complexity: O(1).
  * @param key The key to check.
  * @returns "OK".
  * @see {@link https://redis.io/commands/rename}
  */
  TYPE(key: string): RedisXTransactionCommand<"string" | "list" | "set" | "zset" | "hash" | "stream" | "vectorset">;
  /**
  * Returns all keys matching pattern.
  * - Available since: 1.0.0.
  * - Time complexity: O(N) with N being the number of keys in the database.
  * @param pattern Pattern to match.
  * @returns A set of keys matching pattern.
  * @see {@link https://redis.io/commands/keys}
  */
  KEYS(pattern: string): RedisXTransactionCommand<Set<string>>;
  /**
  * Copy the value stored at the source key to the destination key.
  * - Available since: 6.2.0.
  * - Time complexity: O(N) worst case for collections, where N is the number of nested items. O(1) for string values.
  * @param source The source key.
  * @param destination The destination key.
  * @param options Command options.
  * @returns Whether the copy was successful.
  * @see {@link https://redis.io/commands/copy}
  */
  COPY(source: string, destination: string, options?: CopyOptions): RedisXTransactionCommand<boolean>;
  /**
  * This command has the same effect and semantic as EXPIRE, but instead of specifying the number of seconds representing the TTL (time to live), it takes an absolute Unix timestamp (seconds since January 1, 1970).
  *
  * A timestamp in the past will delete the key immediately.
  * - Available since: 1.2.0.
  * - Time complexity: O(1).
  * @param key Key to set the timeout on.
  * @param timestamp Unix timestamp in seconds.
  * @param options Command options.
  * @returns Returns `true` if the timeout was set. Returns `false` if the timeout was not set; for example, the key doesn't exist, or the operation was skipped because of the provided arguments.
  * @see {@link https://redis.io/commands/expireat}
  * @see {@link https://redis.io/commands/expire}
  */
  EXPIREAT(key: string, timestamp: number, options?: ExpireatOptions): RedisXTransactionCommand<boolean>;
  /**
  * This command has the same effect and semantic as EXPIREAT, but the Unix time at which the key will expire is specified in milliseconds instead of seconds.
  * - Available since: 2.6.0.
  * - Time complexity: O(1).
  * @param key Key to set the timeout on.
  * @param timestamp Unix timestamp in milliseconds.
  * @param options Command options.
  * @returns Returns `true` if the timeout was set. Returns `false` if the timeout was not set; for example, the key doesn't exist, or the operation was skipped because of the provided arguments.
  * @see {@link https://redis.io/commands/pexpireat}
  * @see {@link https://redis.io/commands/expireat}
  */
  PEXPIREAT(key: string, timestamp: number, options?: PexpireatOptions): RedisXTransactionCommand<boolean>;
  /**
  * Remove the existing timeout on key, turning the key from volatile (a key with an expire set) to persistent (a key that will never expire as no timeout is associated).
  *
  * - Available since: 2.2.0.
  * - Time complexity: O(1).
  * @param key The key to persist.
  * @returns Returns `true` if the timeout was removed. Returns `false` if the key does not exist or does not have an associated timeout.
  * @see {@link https://redis.io/commands/persist}
  */
  PERSIST(key: string): RedisXTransactionCommand<boolean>;
  /**
  * Returns the absolute Unix timestamp (since January 1, 1970) in seconds at which the given key will expire.
  * - Available since: 7.0.0.
  * - Time complexity: O(1).
  * @param key Key to get expiration time for.
  * @returns One of the following:
  * - A number representing the expiration Unix timestamp in seconds.
  * - `-1` if the key exists but has no associated expiration time.
  * - `-2` if the key does not exist.
  * @see {@link https://redis.io/commands/expiretime}
  */
  EXPIRETIME(key: string): RedisXTransactionCommand<number>;
  /**
  * Renames `key` to `newkey`. It returns an error when `key` does not exist. If `newkey` already exists it is overwritten.
  *
  * - Available since: 1.0.0.
  * - Time complexity: O(1).
  * @param key The key to rename.
  * @param newkey The new key name.
  * @returns "OK".
  * @see {@link https://redis.io/commands/rename}
  */
  RENAME(key: string, newkey: string): RedisXTransactionCommand<"OK">;
  /**
  * Renames `key` to `newkey` if `newkey` does not yet exist. It returns an error when `key` does not exist.
  *
  * - Available since: 1.0.0.
  * - Time complexity: O(1).
  * @param key The key to rename.
  * @param newkey The new key name.
  * @returns "OK".
  * @see {@link https://redis.io/commands/renamenx}
  */
  RENAMENX(key: string, newkey: string): RedisXTransactionCommand<"OK">;
  /**
  * PEXPIRETIME has the same semantic as EXPIRETIME, but returns the absolute Unix expiration timestamp in milliseconds instead of seconds.
  * - Available since: 7.0.0.
  * - Time complexity: O(1).
  * @param key Key to get expiration time for.
  * @returns One of the following:
  * - A number representing the expiration Unix timestamp in milliseconds.
  * - `-1` if the key exists but has no associated expiration time.
  * - `-2` if the key does not exist.
  * @see {@link https://redis.io/commands/pexpiretime}
  * @see {@link https://redis.io/commands/expiretime}
  */
  PEXPIRETIME(key: string): RedisXTransactionCommand<number>;
  /**
  * Removes the specified keys.
  *
  * A key is ignored if it does not exist.
  * - Available since: 1.0.0.
  * - Time complexity: O(N) where N is the number of keys that will be removed. When a key to remove holds a value other than a string, the individual complexity for this key is O(M) where M is the number of elements in the list, set, sorted set or hash.
  * @param keys Keys to delete.
  * @returns The number of keys that were removed.
  * @see {@link https://redis.io/commands/del}
  */
  DEL(...keys: string[]): RedisXTransactionCommand<number>;
  /**
  * Returns the number of keys that exist from those specified as arguments.
  *
  * The user should be aware that if the same existing key is mentioned in the arguments multiple times, it will be counted multiple times. So if somekey exists, EXISTS somekey somekey will return 2.
  * - Available since: 1.0.0.
  * - Time complexity: O(N) where N is the number of keys to check.
  * @param keys Keys to check.
  * @returns The number of keys existing among the ones specified as arguments.
  * @see {@link https://redis.io/commands/exists}
  */
  EXISTS(...keys: string[]): RedisXTransactionCommand<number>;
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
  * @see {@link https://redis.io/commands/lpush}
  */
  LPUSH(key: string, ...elements: (string | number)[]): RedisXTransactionCommand<number>;
  /**
  * Returns the sorted set cardinality (number of elements) of the sorted set stored at key.
  * - Available since: 1.2.0.
  * - Time complexity: O(1).
  * @param key Key holds a sorted set.
  * @returns The cardinality (number of members) of the sorted set, or 0 if the key doesn't exist.
  * @see {@link https://redis.io/commands/zcard}
  */
  ZCARD(key: string): RedisXTransactionCommand<number>;
  /**
  * Returns the score of member in the sorted set at key.
  * - Available since: 1.0.0.
  * - Time complexity: O(1).
  * @param key Key holds a sorted set.
  * @param member Member in the sorted set.
  * @returns The score of the member (a double-precision floating point number), represented as a string, or `null` if member does not exist in the sorted set, or the key does not exist.
  * @see {@link https://redis.io/commands/zscore}
  */
  ZSCORE(key: string, member: string | number): RedisXTransactionCommand<number | null>;
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
  * @see {@link https://redis.io/commands/zadd}
  */
  ZADD(key: string, score: number, member: string | number, options?: ZaddOptions): RedisXTransactionCommand<number>;
  /**
  * Adds all the specified members with the specified scores to the sorted set stored at key.
  * - Available since: 1.2.0
  * - Multiple score/member pairs are available since Redis 2.4.0.
  * - Time complexity: O(log(N)) for each item added, where N is the number of elements in the sorted set.
  * @param key - Key holds a sorted set.
  * @param pairs - Object containing score/member pairs to set.
  * @param options -
  * @returns The number of fields that were added.
  * @see {@link https://redis.io/commands/zadd}
  */
  ZADD(key: string, pairs: Record<string, number>, options?: Omit<ZaddOptions, "INCR">): RedisXTransactionCommand<number>;
  /**
  * Removes the specified members from the sorted set stored at key. Non existing members are ignored.
  * - Available since: 1.2.0
  * - Time complexity: O(M*log(N)) with N being the number of elements in the sorted set and M the number of elements to be removed.
  * @param key Key holds a sorted set.
  * @param members Members to remove.
  * @returns The number of members removed from the sorted set, not including non-existing members.
  * @see {@link https://redis.io/commands/zrem}
  */
  ZREM(key: string, ...members: (string | number)[]): RedisXTransactionCommand<number>;
  /**
  * Removes the specified members from the sorted set stored at key. Non existing members are ignored.
  * - Available since: 1.2.0
  * - Time complexity: O(M*log(N)) with N being the number of elements in the sorted set and M the number of elements to be removed.
  * @param key Key holds a sorted set.
  * @param members Members to remove.
  * @returns The number of members removed from the sorted set, not including non-existing members.
  * @see {@link https://redis.io/commands/zrem}
  */
  ZREM(key: string, members: (string | number)[] | Set<string> | IterableIterator<string>): RedisXTransactionCommand<number>;
  /**
  * Returns the specified range of elements in the sorted set stored at key.
  * - Available since: 1.2.0
  * - Time complexity: O(log(N)+M) with N being the number of elements in the sorted set and M the number of elements returned.
  * @param key - Key that contains the hash.
  * @param start - Start index by default, minimum score if BY is `SCORE` or minimum lexicographical string if BY is `LEX`.
  * @param stop - Stop index by default, minimum score if BY is `SCORE` or minimum lexicographical string if BY is `LEX`.
  * @param options -
  * @returns List of members in the specified range.
  * @see {@link https://redis.io/commands/zrange}
  */
  ZRANGE(key: string, start: string | number, stop: string | number, options?: Omit<ZrangeOptions, "WITHSCORES">): RedisXTransactionCommand<string[]>;
  /**
  * Returns the specified range of elements in the sorted set stored at key.
  * - Available since: 1.2.0
  * - Time complexity: O(log(N)+M) with N being the number of elements in the sorted set and M the number of elements returned.
  * @param key - Key that contains the hash.
  * @param start - Start index by default, minimum score if BY is `SCORE` or minimum lexicographical string if BY is `LEX`.
  * @param stop - Stop index by default, minimum score if BY is `SCORE` or minimum lexicographical string if BY is `LEX`.
  * @param options -
  * @returns List of members in the specified range with their scores.
  * @see {@link https://redis.io/commands/zrange}
  */
  ZRANGE(key: string, start: string | number, stop: string | number, options: ZrangeOptions): RedisXTransactionCommand<{
    member: string;
    score: number;
  }[]>;
  /**
  * Computes the intersection of sorted sets given by the specified keys, and stores the result in destination. It is mandatory to provide the number of input keys (numkeys) before passing the input keys and the other (optional) arguments.
  * - Available since: 2.0.0.
  * - Time complexity: O(N*K)+O(M*log(M)).
  * @param destination Destination key where the resulting sorted set should be stored.
  * @param keys List of keys that holds sorted sets.
  * @param options -
  * @returns The number of members in the resulting sorted set at the destination.
  * @see {@link https://redis.io/commands/zinterstore}
  */
  ZINTERSTORE(destination: string, keys: (string | number)[], options?: ZinterstoreOptions): RedisXTransactionCommand<number>;
  /**
  * Computes the intersection of sorted sets given by the specified keys, and stores the result in destination. It is mandatory to provide the number of input keys (numkeys) before passing the input keys and the other (optional) arguments.
  * - Available since: 2.0.0.
  * - Time complexity: O(N*K)+O(M*log(M)).
  * @param destination Destination key where the resulting sorted set should be stored.
  * @param keys_with_weights Record where keys are the keys that holds sorted sets and values are the weights to apply to the sorted sets.
  * @param options -
  * @returns The number of members in the resulting sorted set at the destination.
  * @see {@link https://redis.io/commands/zinterstore}
  */
  ZINTERSTORE(destination: string, keys_with_weights: Record<string, number>, options?: ZinterstoreOptions): RedisXTransactionCommand<number>;
  /**
  * Sets the specified fields to their respective values in the hash stored at key.
  * - Available since: 2.0.0.
  * - Multiple field/value pairs are available since Redis 4.0.0.
  * - Time complexity: O(1) for each field/value pair added.
  * @param key Key that contains the hash.
  * @param field Field to set.
  * @param value Value to set.
  * @returns The number of fields that were added.
  * @see {@link https://redis.io/commands/hset}
  */
  HSET(key: string, field: string, value: string | number): RedisXTransactionCommand<number>;
  /**
  * Sets the specified fields to their respective values in the hash stored at key.
  * - Available since: 2.0.0.
  * - Multiple field/value pairs are available since Redis 4.0.0.
  * - Time complexity: O(1) for each field/value pair added.
  * @param key Key that contains the hash.
  * @param pairs Object containing field/value pairs to set.
  * @returns The number of fields that were added.
  * @see {@link https://redis.io/commands/hset}
  */
  HSET(key: string, pairs: Record<string, string | number>): RedisXTransactionCommand<number>;
  /**
  * Returns all fields and values of the hash stored at key.
  * - Available since: 2.0.0.
  * - Time complexity: O(N) where N is the size of the hash.
  * @param key -
  * @returns A record of fields and their values stored in the hash.
  * @see {@link https://redis.io/commands/hgetall}
  */
  HGETALL(key: string): RedisXTransactionCommand<Record<string, string>>;
  /**
  * Returns the value associated with field in the hash stored at key.
  * - Available since: 2.0.0.
  * - Time complexity: O(1)
  * @param key -
  * @param field -
  * @returns The value associated with field in the hash stored at key or null.
  * @see {@link https://redis.io/commands/hget}
  */
  HGET(key: string, field: string): RedisXTransactionCommand<string | null>;
  /**
  * Invoke the execution of a server-side Lua script.
  * - Available since: 2.6.0.
  * - Time complexity: Depends on the script that is executed.
  * @param script Script's source code.
  * @param keys Keys accessed by the script.
  * @param args Arguments passed to the script.
  * @returns Value returned by the script.
  * @see {@link https://redis.io/commands/eval}
  */
  EVAL(script: string, keys: (string | number)[], args?: (string | number)[]): RedisXTransactionCommand<unknown>;
} //#endregion
//#region src/transaction.d.ts
type AddToList<T, U> = T extends any[] ? [...T, U] : [U];
type GetLast<L> = L extends [...any[], infer T] ? T : never;
declare class RedisXTransaction<L = [], C extends boolean = false, D = unknown> {
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
  as<const K extends string>(key: K): RedisXTransaction<L, C, { [P in keyof D | K]: K extends P ? GetLast<L> : P extends keyof D ? D[P] : never }>;
  use<const CB extends (transaction: RedisXTransactionUse) => Promisable<Record<string, any> | void>>(callback: CB): RedisXTransaction<[], true, Awaited<ReturnType<CB>> extends Record<string, any> ? UnwrapRedisXTransactionCommand<Awaited<ReturnType<CB>>> & D : D>;
  execute<RL = (C extends true ? unknown : (L extends [] ? unknown : L)), R = (unknown extends D ? unknown extends RL ? Record<string, never> : RL : RL & { [K in keyof D]: D[K] })>(): Promise<R>;
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
  * @see {@link https://redis.io/commands/get}
  */
  GET(key: string): RedisXTransaction<AddToList<L, string | null>, C, D>;
  /**
  * Set the string value of a key.
  * - Available since: 1.0.0.
  * - Time complexity: O(1).
  * @param key Key to set.
  * @param value Value to set.
  * @returns Returns string `"OK"` if the key was set, or `null` if operation was aborted (conflict with one of the XX/NX options).
  * @see {@link https://redis.io/commands/set}
  */
  SET(key: string, value: string | number): RedisXTransaction<AddToList<L, "OK" | null>, C, D>;
  /**
  * Set the string value of a key.
  * - Available since: 1.0.0.
  * - Time complexity: O(1).
  * @param key Key to set.
  * @param value Value to set.
  * @param options Command options.
  * @returns Returns string `"OK"` if the key was set, or `null` if operation was aborted (conflict with one of the XX/NX options).
  * @see {@link https://redis.io/commands/set}
  */
  SET(key: string, value: string | number, options: SetOptions): RedisXTransaction<AddToList<L, "OK" | null>, C, D>;
  /**
  * Set the string value of a key.
  * - Available since: 1.0.0.
  * - Time complexity: O(1).
  * @param key Key to set.
  * @param value Value to set.
  * @param options Command options.
  * @returns Returns string with the previous value of the key, or `null` if the key didn't exist before the SET.
  * @see {@link https://redis.io/commands/set}
  */
  SET(key: string, value: string | number, options: SetOptions & SetOptionsGet): RedisXTransaction<AddToList<L, string | null>, C, D>;
  /**
  * This command works exactly like EXPIRE but the time to live of the key is specified in milliseconds instead of seconds.
  * - Available since: 2.6.0.
  * - Time complexity: O(1).
  * @param key Key to set the timeout on.
  * @param seconds Time to live in milliseconds.
  * @param options Command options.
  * @returns Returns `true` if the timeout was set. Returns `false` if the timeout was not set; for example, the key doesn't exist, or the operation was skipped because of the provided arguments.
  * @see {@link https://redis.io/commands/pexpire}
  * @see {@link https://redis.io/commands/expire}
  */
  PEXPIRE(key: string, seconds: number, options?: PexpireOptions): RedisXTransaction<AddToList<L, boolean>, C, D>;
  /**
  * Returns the remaining time to live of a key that has a timeout, in milliseconds.
  *
  * Like TTL this command returns the remaining time to live of a key that has an
  * expire set, with the sole difference that TTL returns the amount of remaining
  * time in seconds while PTTL returns it in milliseconds.
  *
  * - Available since: 2.6.0.
  * - Time complexity: O(1).
  * @param key The key to check.
  * @returns One of the following:
  * - A positive integer: TTL in milliseconds.
  * - `-1`: if the key exists but has no associated expiration.
  * - `-2`: if the key does not exist.
  * @see {@link https://redis.io/commands/pttl}
  * @see {@link https://redis.io/commands/ttl}
  */
  PTTL(key: string): RedisXTransaction<AddToList<L, number>, C, D>;
  /**
  * Returns the remaining time to live of a key that has a timeout.
  *
  * This introspection capability allows a Redis client to check how many seconds
  * a given key will continue to be part of the dataset.
  *
  * - Available since: 1.0.0.
  * - Time complexity: O(1).
  * @param key The key to check.
  * @returns One of the following:
  * - A positive integer: TTL in seconds.
  * - `-1`: if the key exists but has no associated expiration.
  * - `-2`: if the key does not exist.
  * @see {@link https://redis.io/commands/ttl}
  */
  TTL(key: string): RedisXTransaction<AddToList<L, number>, C, D>;
  /**
  * Set a timeout on key.
  *
  * After the timeout has expired, the key will automatically be deleted.
  * - Available since: 1.0.0.
  * - Time complexity: O(1).
  * @param key Key to set the timeout on.
  * @param seconds Time to live in seconds.
  * @param options Command options.
  * @returns Returns `true` if the timeout was set. Returns `false` if the timeout was not set; for example, the key doesn't exist, or the operation was skipped because of the provided arguments.
  * @see {@link https://redis.io/commands/expire}
  */
  EXPIRE(key: string, seconds: number, options?: ExpireOptions): RedisXTransaction<AddToList<L, boolean>, C, D>;
  /**
  * Returns the string representation of the type of the value stored at `key`.
  * - Available since: 1.0.0.
  * - Time complexity: O(1).
  * @param key The key to check.
  * @returns "OK".
  * @see {@link https://redis.io/commands/rename}
  */
  TYPE(key: string): RedisXTransaction<AddToList<L, "string" | "list" | "set" | "zset" | "hash" | "stream" | "vectorset">, C, D>;
  /**
  * Returns all keys matching pattern.
  * - Available since: 1.0.0.
  * - Time complexity: O(N) with N being the number of keys in the database.
  * @param pattern Pattern to match.
  * @returns A set of keys matching pattern.
  * @see {@link https://redis.io/commands/keys}
  */
  KEYS(pattern: string): RedisXTransaction<AddToList<L, Set<string>>, C, D>;
  /**
  * Copy the value stored at the source key to the destination key.
  * - Available since: 6.2.0.
  * - Time complexity: O(N) worst case for collections, where N is the number of nested items. O(1) for string values.
  * @param source The source key.
  * @param destination The destination key.
  * @param options Command options.
  * @returns Whether the copy was successful.
  * @see {@link https://redis.io/commands/copy}
  */
  COPY(source: string, destination: string, options?: CopyOptions): RedisXTransaction<AddToList<L, boolean>, C, D>;
  /**
  * This command has the same effect and semantic as EXPIRE, but instead of specifying the number of seconds representing the TTL (time to live), it takes an absolute Unix timestamp (seconds since January 1, 1970).
  *
  * A timestamp in the past will delete the key immediately.
  * - Available since: 1.2.0.
  * - Time complexity: O(1).
  * @param key Key to set the timeout on.
  * @param timestamp Unix timestamp in seconds.
  * @param options Command options.
  * @returns Returns `true` if the timeout was set. Returns `false` if the timeout was not set; for example, the key doesn't exist, or the operation was skipped because of the provided arguments.
  * @see {@link https://redis.io/commands/expireat}
  * @see {@link https://redis.io/commands/expire}
  */
  EXPIREAT(key: string, timestamp: number, options?: ExpireatOptions): RedisXTransaction<AddToList<L, boolean>, C, D>;
  /**
  * This command has the same effect and semantic as EXPIREAT, but the Unix time at which the key will expire is specified in milliseconds instead of seconds.
  * - Available since: 2.6.0.
  * - Time complexity: O(1).
  * @param key Key to set the timeout on.
  * @param timestamp Unix timestamp in milliseconds.
  * @param options Command options.
  * @returns Returns `true` if the timeout was set. Returns `false` if the timeout was not set; for example, the key doesn't exist, or the operation was skipped because of the provided arguments.
  * @see {@link https://redis.io/commands/pexpireat}
  * @see {@link https://redis.io/commands/expireat}
  */
  PEXPIREAT(key: string, timestamp: number, options?: PexpireatOptions): RedisXTransaction<AddToList<L, boolean>, C, D>;
  /**
  * Remove the existing timeout on key, turning the key from volatile (a key with an expire set) to persistent (a key that will never expire as no timeout is associated).
  *
  * - Available since: 2.2.0.
  * - Time complexity: O(1).
  * @param key The key to persist.
  * @returns Returns `true` if the timeout was removed. Returns `false` if the key does not exist or does not have an associated timeout.
  * @see {@link https://redis.io/commands/persist}
  */
  PERSIST(key: string): RedisXTransaction<AddToList<L, boolean>, C, D>;
  /**
  * Returns the absolute Unix timestamp (since January 1, 1970) in seconds at which the given key will expire.
  * - Available since: 7.0.0.
  * - Time complexity: O(1).
  * @param key Key to get expiration time for.
  * @returns One of the following:
  * - A number representing the expiration Unix timestamp in seconds.
  * - `-1` if the key exists but has no associated expiration time.
  * - `-2` if the key does not exist.
  * @see {@link https://redis.io/commands/expiretime}
  */
  EXPIRETIME(key: string): RedisXTransaction<AddToList<L, number>, C, D>;
  /**
  * Renames `key` to `newkey`. It returns an error when `key` does not exist. If `newkey` already exists it is overwritten.
  *
  * - Available since: 1.0.0.
  * - Time complexity: O(1).
  * @param key The key to rename.
  * @param newkey The new key name.
  * @returns "OK".
  * @see {@link https://redis.io/commands/rename}
  */
  RENAME(key: string, newkey: string): RedisXTransaction<AddToList<L, "OK">, C, D>;
  /**
  * Renames `key` to `newkey` if `newkey` does not yet exist. It returns an error when `key` does not exist.
  *
  * - Available since: 1.0.0.
  * - Time complexity: O(1).
  * @param key The key to rename.
  * @param newkey The new key name.
  * @returns "OK".
  * @see {@link https://redis.io/commands/renamenx}
  */
  RENAMENX(key: string, newkey: string): RedisXTransaction<AddToList<L, "OK">, C, D>;
  /**
  * PEXPIRETIME has the same semantic as EXPIRETIME, but returns the absolute Unix expiration timestamp in milliseconds instead of seconds.
  * - Available since: 7.0.0.
  * - Time complexity: O(1).
  * @param key Key to get expiration time for.
  * @returns One of the following:
  * - A number representing the expiration Unix timestamp in milliseconds.
  * - `-1` if the key exists but has no associated expiration time.
  * - `-2` if the key does not exist.
  * @see {@link https://redis.io/commands/pexpiretime}
  * @see {@link https://redis.io/commands/expiretime}
  */
  PEXPIRETIME(key: string): RedisXTransaction<AddToList<L, number>, C, D>;
  /**
  * Removes the specified keys.
  *
  * A key is ignored if it does not exist.
  * - Available since: 1.0.0.
  * - Time complexity: O(N) where N is the number of keys that will be removed. When a key to remove holds a value other than a string, the individual complexity for this key is O(M) where M is the number of elements in the list, set, sorted set or hash.
  * @param keys Keys to delete.
  * @returns The number of keys that were removed.
  * @see {@link https://redis.io/commands/del}
  */
  DEL(...keys: string[]): RedisXTransaction<AddToList<L, number>, C, D>;
  /**
  * Returns the number of keys that exist from those specified as arguments.
  *
  * The user should be aware that if the same existing key is mentioned in the arguments multiple times, it will be counted multiple times. So if somekey exists, EXISTS somekey somekey will return 2.
  * - Available since: 1.0.0.
  * - Time complexity: O(N) where N is the number of keys to check.
  * @param keys Keys to check.
  * @returns The number of keys existing among the ones specified as arguments.
  * @see {@link https://redis.io/commands/exists}
  */
  EXISTS(...keys: string[]): RedisXTransaction<AddToList<L, number>, C, D>;
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
  * @see {@link https://redis.io/commands/lpush}
  */
  LPUSH(key: string, ...elements: (string | number)[]): RedisXTransaction<AddToList<L, number>, C, D>;
  /**
  * Returns the sorted set cardinality (number of elements) of the sorted set stored at key.
  * - Available since: 1.2.0.
  * - Time complexity: O(1).
  * @param key Key holds a sorted set.
  * @returns The cardinality (number of members) of the sorted set, or 0 if the key doesn't exist.
  * @see {@link https://redis.io/commands/zcard}
  */
  ZCARD(key: string): RedisXTransaction<AddToList<L, number>, C, D>;
  /**
  * Returns the score of member in the sorted set at key.
  * - Available since: 1.0.0.
  * - Time complexity: O(1).
  * @param key Key holds a sorted set.
  * @param member Member in the sorted set.
  * @returns The score of the member (a double-precision floating point number), represented as a string, or `null` if member does not exist in the sorted set, or the key does not exist.
  * @see {@link https://redis.io/commands/zscore}
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
  * @see {@link https://redis.io/commands/zadd}
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
  * @see {@link https://redis.io/commands/zadd}
  */
  ZADD(key: string, pairs: Record<string, number>, options?: Omit<ZaddOptions, "INCR">): RedisXTransaction<AddToList<L, number>, C, D>;
  /**
  * Removes the specified members from the sorted set stored at key. Non existing members are ignored.
  * - Available since: 1.2.0
  * - Time complexity: O(M*log(N)) with N being the number of elements in the sorted set and M the number of elements to be removed.
  * @param key Key holds a sorted set.
  * @param members Members to remove.
  * @returns The number of members removed from the sorted set, not including non-existing members.
  * @see {@link https://redis.io/commands/zrem}
  */
  ZREM(key: string, ...members: (string | number)[]): RedisXTransaction<AddToList<L, number>, C, D>;
  /**
  * Removes the specified members from the sorted set stored at key. Non existing members are ignored.
  * - Available since: 1.2.0
  * - Time complexity: O(M*log(N)) with N being the number of elements in the sorted set and M the number of elements to be removed.
  * @param key Key holds a sorted set.
  * @param members Members to remove.
  * @returns The number of members removed from the sorted set, not including non-existing members.
  * @see {@link https://redis.io/commands/zrem}
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
  * @see {@link https://redis.io/commands/zrange}
  */
  ZRANGE(key: string, start: string | number, stop: string | number, options?: Omit<ZrangeOptions, "WITHSCORES">): RedisXTransaction<AddToList<L, string[]>, C, D>;
  /**
  * Returns the specified range of elements in the sorted set stored at key.
  * - Available since: 1.2.0
  * - Time complexity: O(log(N)+M) with N being the number of elements in the sorted set and M the number of elements returned.
  * @param key - Key that contains the hash.
  * @param start - Start index by default, minimum score if BY is `SCORE` or minimum lexicographical string if BY is `LEX`.
  * @param stop - Stop index by default, minimum score if BY is `SCORE` or minimum lexicographical string if BY is `LEX`.
  * @param options -
  * @returns List of members in the specified range with their scores.
  * @see {@link https://redis.io/commands/zrange}
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
  * @see {@link https://redis.io/commands/zinterstore}
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
  * @see {@link https://redis.io/commands/zinterstore}
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
  * @see {@link https://redis.io/commands/hset}
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
  * @see {@link https://redis.io/commands/hset}
  */
  HSET(key: string, pairs: Record<string, string | number>): RedisXTransaction<AddToList<L, number>, C, D>;
  /**
  * Returns all fields and values of the hash stored at key.
  * - Available since: 2.0.0.
  * - Time complexity: O(N) where N is the size of the hash.
  * @param key -
  * @returns A record of fields and their values stored in the hash.
  * @see {@link https://redis.io/commands/hgetall}
  */
  HGETALL(key: string): RedisXTransaction<AddToList<L, Record<string, string>>, C, D>;
  /**
  * Returns the value associated with field in the hash stored at key.
  * - Available since: 2.0.0.
  * - Time complexity: O(1)
  * @param key -
  * @param field -
  * @returns The value associated with field in the hash stored at key or null.
  * @see {@link https://redis.io/commands/hget}
  */
  HGET(key: string, field: string): RedisXTransaction<AddToList<L, string | null>, C, D>;
  /**
  * Invoke the execution of a server-side Lua script.
  * - Available since: 2.6.0.
  * - Time complexity: Depends on the script that is executed.
  * @param script Script's source code.
  * @param keys Keys accessed by the script.
  * @param args Arguments passed to the script.
  * @returns Value returned by the script.
  * @see {@link https://redis.io/commands/eval}
  */
  EVAL(script: string, keys: (string | number)[], args?: (string | number)[]): RedisXTransaction<AddToList<L, unknown>, C, D>;
} //#endregion
//#region src/client.d.ts
declare class RedisXClient {
  private redisClient;
  constructor(redisClient: RedisClient);
  sendCommand<T extends string>(command: T, ...args: (string | number)[]): Promise<unknown>;
  private useCommand;
  createTransaction(): RedisXTransaction<[], false, unknown>;
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
  * @see {@link https://redis.io/commands/get}
  */
  GET(key: string): Promise<string | null>;
  /**
  * Set the string value of a key.
  * - Available since: 1.0.0.
  * - Time complexity: O(1).
  * @param key Key to set.
  * @param value Value to set.
  * @returns Returns string `"OK"` if the key was set, or `null` if operation was aborted (conflict with one of the XX/NX options).
  * @see {@link https://redis.io/commands/set}
  */
  SET(key: string, value: string | number): Promise<"OK" | null>;
  /**
  * Set the string value of a key.
  * - Available since: 1.0.0.
  * - Time complexity: O(1).
  * @param key Key to set.
  * @param value Value to set.
  * @param options Command options.
  * @returns Returns string `"OK"` if the key was set, or `null` if operation was aborted (conflict with one of the XX/NX options).
  * @see {@link https://redis.io/commands/set}
  */
  SET(key: string, value: string | number, options: SetOptions): Promise<"OK" | null>;
  /**
  * Set the string value of a key.
  * - Available since: 1.0.0.
  * - Time complexity: O(1).
  * @param key Key to set.
  * @param value Value to set.
  * @param options Command options.
  * @returns Returns string with the previous value of the key, or `null` if the key didn't exist before the SET.
  * @see {@link https://redis.io/commands/set}
  */
  SET(key: string, value: string | number, options: SetOptions & SetOptionsGet): Promise<string | null>;
  /**
  * This command works exactly like EXPIRE but the time to live of the key is specified in milliseconds instead of seconds.
  * - Available since: 2.6.0.
  * - Time complexity: O(1).
  * @param key Key to set the timeout on.
  * @param seconds Time to live in milliseconds.
  * @param options Command options.
  * @returns Returns `true` if the timeout was set. Returns `false` if the timeout was not set; for example, the key doesn't exist, or the operation was skipped because of the provided arguments.
  * @see {@link https://redis.io/commands/pexpire}
  * @see {@link https://redis.io/commands/expire}
  */
  PEXPIRE(key: string, seconds: number, options?: PexpireOptions): Promise<boolean>;
  /**
  * Returns the remaining time to live of a key that has a timeout, in milliseconds.
  *
  * Like TTL this command returns the remaining time to live of a key that has an
  * expire set, with the sole difference that TTL returns the amount of remaining
  * time in seconds while PTTL returns it in milliseconds.
  *
  * - Available since: 2.6.0.
  * - Time complexity: O(1).
  * @param key The key to check.
  * @returns One of the following:
  * - A positive integer: TTL in milliseconds.
  * - `-1`: if the key exists but has no associated expiration.
  * - `-2`: if the key does not exist.
  * @see {@link https://redis.io/commands/pttl}
  * @see {@link https://redis.io/commands/ttl}
  */
  PTTL(key: string): Promise<number>;
  /**
  * Returns the remaining time to live of a key that has a timeout.
  *
  * This introspection capability allows a Redis client to check how many seconds
  * a given key will continue to be part of the dataset.
  *
  * - Available since: 1.0.0.
  * - Time complexity: O(1).
  * @param key The key to check.
  * @returns One of the following:
  * - A positive integer: TTL in seconds.
  * - `-1`: if the key exists but has no associated expiration.
  * - `-2`: if the key does not exist.
  * @see {@link https://redis.io/commands/ttl}
  */
  TTL(key: string): Promise<number>;
  /**
  * Set a timeout on key.
  *
  * After the timeout has expired, the key will automatically be deleted.
  * - Available since: 1.0.0.
  * - Time complexity: O(1).
  * @param key Key to set the timeout on.
  * @param seconds Time to live in seconds.
  * @param options Command options.
  * @returns Returns `true` if the timeout was set. Returns `false` if the timeout was not set; for example, the key doesn't exist, or the operation was skipped because of the provided arguments.
  * @see {@link https://redis.io/commands/expire}
  */
  EXPIRE(key: string, seconds: number, options?: ExpireOptions): Promise<boolean>;
  /**
  * Returns the string representation of the type of the value stored at `key`.
  * - Available since: 1.0.0.
  * - Time complexity: O(1).
  * @param key The key to check.
  * @returns "OK".
  * @see {@link https://redis.io/commands/rename}
  */
  TYPE(key: string): Promise<"string" | "list" | "set" | "zset" | "hash" | "stream" | "vectorset">;
  /**
  * Returns all keys matching pattern.
  * - Available since: 1.0.0.
  * - Time complexity: O(N) with N being the number of keys in the database.
  * @param pattern Pattern to match.
  * @returns A set of keys matching pattern.
  * @see {@link https://redis.io/commands/keys}
  */
  KEYS(pattern: string): Promise<Set<string>>;
  /**
  * Copy the value stored at the source key to the destination key.
  * - Available since: 6.2.0.
  * - Time complexity: O(N) worst case for collections, where N is the number of nested items. O(1) for string values.
  * @param source The source key.
  * @param destination The destination key.
  * @param options Command options.
  * @returns Whether the copy was successful.
  * @see {@link https://redis.io/commands/copy}
  */
  COPY(source: string, destination: string, options?: CopyOptions): Promise<boolean>;
  /**
  * This command has the same effect and semantic as EXPIRE, but instead of specifying the number of seconds representing the TTL (time to live), it takes an absolute Unix timestamp (seconds since January 1, 1970).
  *
  * A timestamp in the past will delete the key immediately.
  * - Available since: 1.2.0.
  * - Time complexity: O(1).
  * @param key Key to set the timeout on.
  * @param timestamp Unix timestamp in seconds.
  * @param options Command options.
  * @returns Returns `true` if the timeout was set. Returns `false` if the timeout was not set; for example, the key doesn't exist, or the operation was skipped because of the provided arguments.
  * @see {@link https://redis.io/commands/expireat}
  * @see {@link https://redis.io/commands/expire}
  */
  EXPIREAT(key: string, timestamp: number, options?: ExpireatOptions): Promise<boolean>;
  /**
  * This command has the same effect and semantic as EXPIREAT, but the Unix time at which the key will expire is specified in milliseconds instead of seconds.
  * - Available since: 2.6.0.
  * - Time complexity: O(1).
  * @param key Key to set the timeout on.
  * @param timestamp Unix timestamp in milliseconds.
  * @param options Command options.
  * @returns Returns `true` if the timeout was set. Returns `false` if the timeout was not set; for example, the key doesn't exist, or the operation was skipped because of the provided arguments.
  * @see {@link https://redis.io/commands/pexpireat}
  * @see {@link https://redis.io/commands/expireat}
  */
  PEXPIREAT(key: string, timestamp: number, options?: PexpireatOptions): Promise<boolean>;
  /**
  * Remove the existing timeout on key, turning the key from volatile (a key with an expire set) to persistent (a key that will never expire as no timeout is associated).
  *
  * - Available since: 2.2.0.
  * - Time complexity: O(1).
  * @param key The key to persist.
  * @returns Returns `true` if the timeout was removed. Returns `false` if the key does not exist or does not have an associated timeout.
  * @see {@link https://redis.io/commands/persist}
  */
  PERSIST(key: string): Promise<boolean>;
  /**
  * Returns the absolute Unix timestamp (since January 1, 1970) in seconds at which the given key will expire.
  * - Available since: 7.0.0.
  * - Time complexity: O(1).
  * @param key Key to get expiration time for.
  * @returns One of the following:
  * - A number representing the expiration Unix timestamp in seconds.
  * - `-1` if the key exists but has no associated expiration time.
  * - `-2` if the key does not exist.
  * @see {@link https://redis.io/commands/expiretime}
  */
  EXPIRETIME(key: string): Promise<number>;
  /**
  * Renames `key` to `newkey`. It returns an error when `key` does not exist. If `newkey` already exists it is overwritten.
  *
  * - Available since: 1.0.0.
  * - Time complexity: O(1).
  * @param key The key to rename.
  * @param newkey The new key name.
  * @returns "OK".
  * @see {@link https://redis.io/commands/rename}
  */
  RENAME(key: string, newkey: string): Promise<"OK">;
  /**
  * Renames `key` to `newkey` if `newkey` does not yet exist. It returns an error when `key` does not exist.
  *
  * - Available since: 1.0.0.
  * - Time complexity: O(1).
  * @param key The key to rename.
  * @param newkey The new key name.
  * @returns "OK".
  * @see {@link https://redis.io/commands/renamenx}
  */
  RENAMENX(key: string, newkey: string): Promise<"OK">;
  /**
  * PEXPIRETIME has the same semantic as EXPIRETIME, but returns the absolute Unix expiration timestamp in milliseconds instead of seconds.
  * - Available since: 7.0.0.
  * - Time complexity: O(1).
  * @param key Key to get expiration time for.
  * @returns One of the following:
  * - A number representing the expiration Unix timestamp in milliseconds.
  * - `-1` if the key exists but has no associated expiration time.
  * - `-2` if the key does not exist.
  * @see {@link https://redis.io/commands/pexpiretime}
  * @see {@link https://redis.io/commands/expiretime}
  */
  PEXPIRETIME(key: string): Promise<number>;
  /**
  * Removes the specified keys.
  *
  * A key is ignored if it does not exist.
  * - Available since: 1.0.0.
  * - Time complexity: O(N) where N is the number of keys that will be removed. When a key to remove holds a value other than a string, the individual complexity for this key is O(M) where M is the number of elements in the list, set, sorted set or hash.
  * @param keys Keys to delete.
  * @returns The number of keys that were removed.
  * @see {@link https://redis.io/commands/del}
  */
  DEL(...keys: string[]): Promise<number>;
  /**
  * Returns the number of keys that exist from those specified as arguments.
  *
  * The user should be aware that if the same existing key is mentioned in the arguments multiple times, it will be counted multiple times. So if somekey exists, EXISTS somekey somekey will return 2.
  * - Available since: 1.0.0.
  * - Time complexity: O(N) where N is the number of keys to check.
  * @param keys Keys to check.
  * @returns The number of keys existing among the ones specified as arguments.
  * @see {@link https://redis.io/commands/exists}
  */
  EXISTS(...keys: string[]): Promise<number>;
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
  * @see {@link https://redis.io/commands/lpush}
  */
  LPUSH(key: string, ...elements: (string | number)[]): Promise<number>;
  /**
  * Returns the sorted set cardinality (number of elements) of the sorted set stored at key.
  * - Available since: 1.2.0.
  * - Time complexity: O(1).
  * @param key Key holds a sorted set.
  * @returns The cardinality (number of members) of the sorted set, or 0 if the key doesn't exist.
  * @see {@link https://redis.io/commands/zcard}
  */
  ZCARD(key: string): Promise<number>;
  /**
  * Returns the score of member in the sorted set at key.
  * - Available since: 1.0.0.
  * - Time complexity: O(1).
  * @param key Key holds a sorted set.
  * @param member Member in the sorted set.
  * @returns The score of the member (a double-precision floating point number), represented as a string, or `null` if member does not exist in the sorted set, or the key does not exist.
  * @see {@link https://redis.io/commands/zscore}
  */
  ZSCORE(key: string, member: string | number): Promise<number | null>;
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
  * @see {@link https://redis.io/commands/zadd}
  */
  ZADD(key: string, score: number, member: string | number, options?: ZaddOptions): Promise<number>;
  /**
  * Adds all the specified members with the specified scores to the sorted set stored at key.
  * - Available since: 1.2.0
  * - Multiple score/member pairs are available since Redis 2.4.0.
  * - Time complexity: O(log(N)) for each item added, where N is the number of elements in the sorted set.
  * @param key - Key holds a sorted set.
  * @param pairs - Object containing score/member pairs to set.
  * @param options -
  * @returns The number of fields that were added.
  * @see {@link https://redis.io/commands/zadd}
  */
  ZADD(key: string, pairs: Record<string, number>, options?: Omit<ZaddOptions, "INCR">): Promise<number>;
  /**
  * Removes the specified members from the sorted set stored at key. Non existing members are ignored.
  * - Available since: 1.2.0
  * - Time complexity: O(M*log(N)) with N being the number of elements in the sorted set and M the number of elements to be removed.
  * @param key Key holds a sorted set.
  * @param members Members to remove.
  * @returns The number of members removed from the sorted set, not including non-existing members.
  * @see {@link https://redis.io/commands/zrem}
  */
  ZREM(key: string, ...members: (string | number)[]): Promise<number>;
  /**
  * Removes the specified members from the sorted set stored at key. Non existing members are ignored.
  * - Available since: 1.2.0
  * - Time complexity: O(M*log(N)) with N being the number of elements in the sorted set and M the number of elements to be removed.
  * @param key Key holds a sorted set.
  * @param members Members to remove.
  * @returns The number of members removed from the sorted set, not including non-existing members.
  * @see {@link https://redis.io/commands/zrem}
  */
  ZREM(key: string, members: (string | number)[] | Set<string> | IterableIterator<string>): Promise<number>;
  /**
  * Returns the specified range of elements in the sorted set stored at key.
  * - Available since: 1.2.0
  * - Time complexity: O(log(N)+M) with N being the number of elements in the sorted set and M the number of elements returned.
  * @param key - Key that contains the hash.
  * @param start - Start index by default, minimum score if BY is `SCORE` or minimum lexicographical string if BY is `LEX`.
  * @param stop - Stop index by default, minimum score if BY is `SCORE` or minimum lexicographical string if BY is `LEX`.
  * @param options -
  * @returns List of members in the specified range.
  * @see {@link https://redis.io/commands/zrange}
  */
  ZRANGE(key: string, start: string | number, stop: string | number, options?: Omit<ZrangeOptions, "WITHSCORES">): Promise<string[]>;
  /**
  * Returns the specified range of elements in the sorted set stored at key.
  * - Available since: 1.2.0
  * - Time complexity: O(log(N)+M) with N being the number of elements in the sorted set and M the number of elements returned.
  * @param key - Key that contains the hash.
  * @param start - Start index by default, minimum score if BY is `SCORE` or minimum lexicographical string if BY is `LEX`.
  * @param stop - Stop index by default, minimum score if BY is `SCORE` or minimum lexicographical string if BY is `LEX`.
  * @param options -
  * @returns List of members in the specified range with their scores.
  * @see {@link https://redis.io/commands/zrange}
  */
  ZRANGE(key: string, start: string | number, stop: string | number, options: ZrangeOptions): Promise<{
    member: string;
    score: number;
  }[]>;
  /**
  * Computes the intersection of sorted sets given by the specified keys, and stores the result in destination. It is mandatory to provide the number of input keys (numkeys) before passing the input keys and the other (optional) arguments.
  * - Available since: 2.0.0.
  * - Time complexity: O(N*K)+O(M*log(M)).
  * @param destination Destination key where the resulting sorted set should be stored.
  * @param keys List of keys that holds sorted sets.
  * @param options -
  * @returns The number of members in the resulting sorted set at the destination.
  * @see {@link https://redis.io/commands/zinterstore}
  */
  ZINTERSTORE(destination: string, keys: (string | number)[], options?: ZinterstoreOptions): Promise<number>;
  /**
  * Computes the intersection of sorted sets given by the specified keys, and stores the result in destination. It is mandatory to provide the number of input keys (numkeys) before passing the input keys and the other (optional) arguments.
  * - Available since: 2.0.0.
  * - Time complexity: O(N*K)+O(M*log(M)).
  * @param destination Destination key where the resulting sorted set should be stored.
  * @param keys_with_weights Record where keys are the keys that holds sorted sets and values are the weights to apply to the sorted sets.
  * @param options -
  * @returns The number of members in the resulting sorted set at the destination.
  * @see {@link https://redis.io/commands/zinterstore}
  */
  ZINTERSTORE(destination: string, keys_with_weights: Record<string, number>, options?: ZinterstoreOptions): Promise<number>;
  /**
  * Sets the specified fields to their respective values in the hash stored at key.
  * - Available since: 2.0.0.
  * - Multiple field/value pairs are available since Redis 4.0.0.
  * - Time complexity: O(1) for each field/value pair added.
  * @param key Key that contains the hash.
  * @param field Field to set.
  * @param value Value to set.
  * @returns The number of fields that were added.
  * @see {@link https://redis.io/commands/hset}
  */
  HSET(key: string, field: string, value: string | number): Promise<number>;
  /**
  * Sets the specified fields to their respective values in the hash stored at key.
  * - Available since: 2.0.0.
  * - Multiple field/value pairs are available since Redis 4.0.0.
  * - Time complexity: O(1) for each field/value pair added.
  * @param key Key that contains the hash.
  * @param pairs Object containing field/value pairs to set.
  * @returns The number of fields that were added.
  * @see {@link https://redis.io/commands/hset}
  */
  HSET(key: string, pairs: Record<string, string | number>): Promise<number>;
  /**
  * Returns all fields and values of the hash stored at key.
  * - Available since: 2.0.0.
  * - Time complexity: O(N) where N is the size of the hash.
  * @param key -
  * @returns A record of fields and their values stored in the hash.
  * @see {@link https://redis.io/commands/hgetall}
  */
  HGETALL(key: string): Promise<Record<string, string>>;
  /**
  * Returns the value associated with field in the hash stored at key.
  * - Available since: 2.0.0.
  * - Time complexity: O(1)
  * @param key -
  * @param field -
  * @returns The value associated with field in the hash stored at key or null.
  * @see {@link https://redis.io/commands/hget}
  */
  HGET(key: string, field: string): Promise<string | null>;
  /**
  * Invoke the execution of a server-side Lua script.
  * - Available since: 2.6.0.
  * - Time complexity: Depends on the script that is executed.
  * @param script Script's source code.
  * @param keys Keys accessed by the script.
  * @param args Arguments passed to the script.
  * @returns Value returned by the script.
  * @see {@link https://redis.io/commands/eval}
  */
  EVAL(script: string, keys: (string | number)[], args?: (string | number)[]): Promise<unknown>;
}

//#endregion
export { RedisXClient, RedisXTransaction };