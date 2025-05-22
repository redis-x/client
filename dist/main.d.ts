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
//#region src/commands/string/getex.d.ts
type GetexOptions = {
  /**
  * Set the specified expire time, in *seconds*.
  * - Incompatible with options `PX`, `EXAT`, `PXAT` and `PERSIST`.
  * - Available since: 6.2.0.
  */
  EX?: number;
  /**
  * Set the specified expire time, in *milliseconds*.
  * - Incompatible with options `EX`, `EXAT`, `PXAT` and `PERSIST`.
  * - Available since: 6.2.0.
  */
  PX?: number;
  /**
  * Set the specified Unix time at which the key will expire, in *seconds*.
  * - Incompatible with options `EX`, `PX`, `PXAT` and `PERSIST`.
  * - Available since: 6.2.0.
  */
  EXAT?: number;
  /**
  * Set the specified Unix time at which the key will expire, in *milliseconds*.
  * - Incompatible with options `EX`, `PX`, `EXAT` and `PERSIST`.
  * - Available since: 6.2.0.
  */
  PXAT?: number;
  /**
  * Remove the time to live associated with the key.
  * - Incompatible with options `EX`, `PX`, `EXAT` and `PXAT`.
  * - Available since: 6.2.0.
  */
  PERSIST?: boolean;
};

//#endregion
//#region src/commands/generic/pexpire.d.ts
/**
* Get the value of key and optionally set its expiration.
* GETEX is similar to GET, but is a write command with additional options.
*
* An error is returned if the value stored at key is not a string, because GETEX only handles string values.
* - Available since: 6.2.0.
* - Time complexity: O(1).
* @param key Key to get.
* @param options Command options.
* @returns The value of key, or `null` when key does not exist.
* @see {@link https://redis.io/commands/getex}
*/
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
  * Remove the specified members from the set stored at key.
  * Specified members that are not a member of this set are ignored.
  * If key does not exist, it is treated as an empty set and this command returns 0.
  *
  * - Available since: 1.0.0. Multiple members support added in 2.4.0.
  * - Time complexity: O(N) where N is the number of members to be removed.
  * @param key Key of the set.
  * @param member Member to remove from the set.
  * @returns The number of members that were removed from the set, not including non existing members.
  * @see {@link https://redis.io/commands/srem}
  */
  SREM(key: string, member: (string | number)[]): RedisXTransactionCommand<number>;
  /**
  * Remove the specified members from the set stored at key.
  * Specified members that are not a member of this set are ignored.
  * If key does not exist, it is treated as an empty set and this command returns 0.
  *
  * - Available since: 1.0.0. Multiple members support added in 2.4.0.
  * - Time complexity: O(N) where N is the number of members to be removed.
  * @param key Key of the set.
  * @param members Members to remove from the set.
  * @returns The number of members that were removed from the set, not including non existing members.
  * @see {@link https://redis.io/commands/srem}
  */
  SREM(key: string, ...members: (string | number)[]): RedisXTransactionCommand<number>;
  /**
  * Returns whether each member is a member of the set stored at key.
  *
  * For every member, `true` is returned if the value is a member of the set,
  * or `false` if the element is not a member of the set or if key does not exist.
  *
  * - Available since: 6.2.0.
  * - Time complexity: O(N) where N is the number of elements being checked for membership.
  * @param key The key of the set.
  * @param members The members to check.
  * @returns An array of booleans, representing the membership of the given elements in the same order as they are requested.
  * @see {@link https://redis.io/commands/smismember}
  */
  SMISMEMBER(key: string, ...members: string[]): RedisXTransactionCommand<boolean[]>;
  /**
  * Returns all the members of the set value stored at key.
  *
  * - Available since: 1.0.0.
  * - Time complexity: O(N) where N is the set cardinality.
  * @param key The key of the set.
  * @returns A set with all the members of the set.
  * @see {@link https://redis.io/commands/smembers}
  */
  SMEMBERS(key: string): RedisXTransactionCommand<Set<string>>;
  /**
  * Returns if member is a member of the set stored at key.
  *
  * - Available since: 1.0.0.
  * - Time complexity: O(1).
  * @param key The key of the set.
  * @param member The member to check.
  * @returns `true` if the member is a member of the set stored at key, `false` otherwise.
  * @see {@link https://redis.io/commands/sismember}
  */
  SISMEMBER(key: string, member: string): RedisXTransactionCommand<boolean>;
  /**
  * Returns the set cardinality (number of elements) of the set stored at key.
  *
  * - Available since: 1.0.0.
  * - Time complexity: O(1).
  * @param key The key of the set.
  * @returns The cardinality (number of elements) of the set, or `0` if the key does not exist.
  * @see {@link https://redis.io/commands/scard}
  */
  SCARD(key: string): RedisXTransactionCommand<number>;
  /**
  * Add the specified members to the set stored at key.
  * Specified members that are already a member of this set are ignored.
  * If key does not exist, a new set is created before adding the specified members.
  *
  * An error is returned when the value stored at key is not a set.
  *
  * - Available since: 1.0.0. Multiple members support added in 2.4.0.
  * - Time complexity: O(1) for each element added.
  * @param key Key of the set.
  * @param member Member to add to the set.
  * @returns The number of elements that were added to the set, not including all the elements already present in the set.
  * @see {@link https://redis.io/commands/sadd}
  */
  SADD(key: string, member: (string | number)[]): RedisXTransactionCommand<number>;
  /**
  * Add the specified members to the set stored at key.
  * Specified members that are already a member of this set are ignored.
  * If key does not exist, a new set is created before adding the specified members.
  *
  * An error is returned when the value stored at key is not a set.
  *
  * - Available since: 1.0.0. Multiple members support added in 2.4.0.
  * - Time complexity: O(1) for each element added.
  * @param key Key of the set.
  * @param members Members to add to the set.
  * @returns The number of elements that were added to the set, not including all the elements already present in the set.
  * @see {@link https://redis.io/commands/sadd}
  */
  SADD(key: string, ...members: (string | number)[]): RedisXTransactionCommand<number>;
  /**
  * Sets the given keys to their respective values. MSETNX will not perform
  * any operation at all even if just a single key already exists.
  *
  * - Available since: 1.0.1.
  * - Time complexity: O(N) where N is the number of keys to set.
  * @param pairs A record of key-value pairs.
  * @returns `true` if all the keys were set, `false` if no key was set (at least one key already existed).
  * @see {@link https://redis.io/commands/msetnx}
  */
  MSETNX(pairs: Record<string, string | number>): RedisXTransactionCommand<boolean>;
  /**
  * Set key to hold string value if key does not exist. In that case, it is equal to SET.
  * When key already holds a value, no operation is performed. SETNX is short for "SET if Not eXists".
  *
  * - Available since: 1.0.0.
  * - Time complexity: O(1).
  * @deprecated As of Redis version 2.6.12, this command is regarded as deprecated. It can be replaced by SET with the NX argument when migrating or writing new code.
  * @param key Key to set.
  * @param value Value to set.
  * @returns Integer reply: 1 if the key was set, 0 if the key was not set.
  * @see {@link https://redis.io/commands/setnx}
  */
  SETNX(key: string, value: string | number): RedisXTransactionCommand<boolean>;
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
  * Append a value to a key.
  *
  * If key already exists and is a string, this command appends the value at the end of the string.
  * If key does not exist it is created and set as an empty string, so APPEND will be similar to SET in this special case.
  * - Available since: 2.0.0.
  * - Time complexity: O(1). The amortized time complexity is O(1) assuming the appended value is small and the already present value is of any size, since the dynamic string library used by Redis will double the free space available on every reallocation.
  * @param key Key to append to.
  * @param value Value to append.
  * @returns The length of the string after the append operation.
  * @see {@link https://redis.io/commands/append}
  */
  APPEND(key: string, value: string): RedisXTransactionCommand<number>;
  /**
  * Increments the number stored at key by one. If the key does not exist,
  * it is set to 0 before performing the operation. An error is returned if the
  * key contains a value of the wrong type or contains a string that can not
  * be represented as integer. This operation is limited to 64 bit signed integers.
  * - Available since: 1.0.0.
  * - Time complexity: O(1).
  * @param key Key to increment.
  * @returns The value of the key after incrementing it.
  * @see {@link https://redis.io/commands/incr}
  */
  INCR(key: string): RedisXTransactionCommand<number>;
  /**
  * Increment the string representing a floating point number stored at key by the specified increment.
  * By using a negative increment value, the result is that the value stored at the key is decremented.
  * If the key does not exist, it is set to 0 before performing the operation.
  *
  * - Available since: 2.6.0.
  * - Time complexity: O(1).
  * @param key Key to increment.
  * @param increment Value to increment by.
  * @returns The value of key after the increment.
  * @see {@link https://redis.io/commands/incrbyfloat}
  */
  INCRBYFLOAT(key: string, increment: number): RedisXTransactionCommand<string>;
  /**
  * Returns the values of all specified keys. For every key that does not hold a
  * string value or does not exist, the special value `null` is returned.
  * Because of this, the operation never fails.
  *
  * - Available since: 1.0.0.
  * - Time complexity: O(N) where N is the number of keys to retrieve.
  * @param keys The keys to get.
  * @returns Array reply: a list of values at the specified keys.
  * @see {@link https://redis.io/commands/mget}
  */
  MGET<const K extends string[]>(keys: K): RedisXTransactionCommand<{ [I in keyof K]: string | null }>;
  /**
  * Returns the values of all specified keys. For every key that does not hold a
  * string value or does not exist, the special value `null` is returned.
  * Because of this, the operation never fails.
  *
  * - Available since: 1.0.0.
  * - Time complexity: O(N) where N is the number of keys to retrieve.
  * @param keys The keys to get.
  * @returns Array reply: a list of values at the specified keys.
  * @see {@link https://redis.io/commands/mget}
  */
  MGET<const K extends string[]>(...keys: K): RedisXTransactionCommand<{ [I in keyof K]: string | null }>;
  /**
  * Get the value of key and delete the key. This command is similar to GET, except for the fact
  * that it also deletes the key on success (if and only if the key's value type is a string).
  *
  * - Available since: 6.2.0.
  * - Time complexity: O(1).
  * @param key Key to get and delete.
  * @returns The value of key, or `null` when key does not exist or its value is not a string.
  * @see {@link https://redis.io/commands/getdel}
  */
  GETDEL(key: string): RedisXTransactionCommand<string | null>;
  /**
  * Sets the given keys to their respective values. MSET replaces existing values with new values, just as regular SET.
  * MSET is atomic, so all given keys are set at once. It is not possible for clients to see that some of the keys were updated while others are unchanged.
  * - Available since: 1.0.1.
  * - Time complexity: O(N) where N is the number of keys to set.
  * @param pairs A record of key-value pairs.
  * @returns "OK"
  * @see {@link https://redis.io/commands/mset}
  */
  MSET(pairs: Record<string, string | number>): RedisXTransactionCommand<"OK">;
  /**
  * Increments the number stored at key by increment. If the key does not exist, it is set to 0 before performing the operation.
  * An error is returned if the key contains a value of the wrong type or contains a string that cannot be represented as integer.
  * This operation is limited to 64 bit signed integers.
  *
  * - Available since: 1.0.0.
  * - Time complexity: O(1).
  * @param key Key to increment.
  * @param increment Amount to increment by.
  * @returns The value of the key after the increment.
  * @see {@link https://redis.io/commands/incrby}
  */
  INCRBY(key: string, increment: number): RedisXTransactionCommand<number>;
  /**
  * Overwrites part of the string stored at key, starting at the specified offset, for the entire length of value.
  * If the offset is larger than the current length of the string at key, the string is padded with zero-bytes to make offset fit.
  * Non-existing keys are considered as empty strings, so this command will make sure it holds a string large enough to be able to set value at offset.
  *
  * Note that the maximum offset that you can set is `2^29-1` (536870911), as Redis Strings are limited to 512 megabytes.
  *
  * - Available since: 2.2.0.
  * - Time complexity: O(1), not counting the time taken to copy the new string in place. Usually, this string is very small so the amortized complexity is O(1). Otherwise, complexity is O(M) with M being the length of the value argument.
  * @param key Key to modify.
  * @param offset Position at which the overwrite should begin.
  * @param value String that will be written to the key, starting at the specified offset.
  * @returns The length of the string after it was modified by the command.
  * @see {@link https://redis.io/commands/setrange}
  */
  SETRANGE(key: string, offset: number, value: string): RedisXTransactionCommand<number>;
  /**
  * Returns the substring of the string value stored at key, determined by the offsets start and end (both are inclusive).
  * Negative offsets can be used in order to provide an offset starting from the end of the string.
  * So -1 means the last character, -2 the penultimate and so forth.
  * - Available since: 1.0.0.
  * - Time complexity: O(N) where N is the length of the returned string. The complexity is ultimately determined by the returned length, but because creating a substring from an existing string is very cheap, it can be considered O(1) for small strings.
  * @deprecated As of Redis version 2.0.0, this command is regarded as deprecated. It can be replaced by GETRANGE when migrating or writing new code.
  * @param key Key to get the substring from.
  * @param start Start offset (inclusive).
  * @param end End offset (inclusive).
  * @returns The substring of the string value stored at key.
  * @see {@link https://redis.io/commands/substr}
  */
  SUBSTR(key: string, start: number, end: number): RedisXTransactionCommand<string>;
  /**
  * Atomically sets key to value and returns the old value stored at key.
  * Returns an error when key exists but does not hold a string value.
  * Any previous time to live associated with the key is discarded on successful SET operation.
  *
  * - Available since: 1.0.0.
  * - Time complexity: O(1).
  * @deprecated As of Redis version 6.2.0, this command is regarded as deprecated. It can be replaced by SET with the GET argument when migrating or writing new code.
  * @param key Key to set.
  * @param value Value to set.
  * @returns The old value stored at key, or `null` if key did not exist.
  * @see {@link https://redis.io/commands/getset}
  */
  GETSET(key: string, value: string | number): RedisXTransactionCommand<string | null>;
  /**
  * Reduces the value stored at the specified key by the specified decrement.
  * If the key does not exist, it is initialized with a value of 0 before performing the operation.
  * If the key's value is not of the correct type or cannot be represented as an integer, an error is returned.
  * This operation is limited to 64-bit signed integers.
  *
  * - Available since: 1.0.0.
  * - Time complexity: O(1).
  * @param key Key to decrement.
  * @param decrement The value to decrement by.
  * @returns The value of the key after decrementing it.
  * @see {@link https://redis.io/commands/decrby}
  */
  DECRBY(key: string, decrement: number): RedisXTransactionCommand<number>;
  /**
  * Returns the substring of the string value stored at key, determined by the offsets start and end (both are inclusive).
  * Negative offsets can be used in order to provide an offset starting from the end of the string.
  * So -1 means the last character, -2 the penultimate and so forth.
  *
  * The function handles out of range requests by limiting the resulting range to the actual length of the string.
  * - Available since: 2.4.0.
  * - Time complexity: O(N) where N is the length of the returned string. The complexity is ultimately determined by the returned length, but because creating a substring from an existing string is very cheap, it can be considered O(1) for small strings.
  * @param key The key holding the string value.
  * @param start The starting offset. Can be negative to count from the end of the string.
  * @param end The ending offset (inclusive). Can be negative to count from the end of the string.
  * @returns The substring.
  * @see {@link https://redis.io/commands/getrange}
  */
  GETRANGE(key: string, start: number, end: number): RedisXTransactionCommand<string>;
  /**
  * Set key to hold the string value and set key to timeout after a given number of seconds.
  * This command is equivalent to SET key value EX seconds.
  *
  * - Available since: 2.0.0.
  * - Time complexity: O(1).
  * @deprecated As of Redis version 2.6.12, this command is regarded as deprecated. It can be replaced by SET with the EX argument when migrating or writing new code.
  * @param key Key to set.
  * @param seconds Timeout in seconds.
  * @param value Value to set.
  * @returns Simple string reply: OK.
  * @see {@link https://redis.io/commands/setex}
  */
  SETEX(key: string, seconds: number, value: string | number): RedisXTransactionCommand<"OK">;
  /**
  * Get the value of key and optionally set its expiration.
  * GETEX is similar to GET, but is a write command with additional options.
  *
  * An error is returned if the value stored at key is not a string, because GETEX only handles string values.
  * - Available since: 6.2.0.
  * - Time complexity: O(1).
  * @param key Key to get.
  * @param options Command options.
  * @returns The value of key, or `null` when key does not exist.
  * @see {@link https://redis.io/commands/getex}
  */
  GETEX(key: string, options?: GetexOptions): RedisXTransactionCommand<string | null>;
  /**
  * Returns the length of the string value stored at key.
  * An error is returned when key holds a non-string value.
  *
  * - Available since: 2.2.0.
  * - Time complexity: O(1).
  * @param key Key to get length of.
  * @returns The length of the string stored at key, or 0 when the key does not exist.
  * @see {@link https://redis.io/commands/strlen}
  */
  STRLEN(key: string): RedisXTransactionCommand<number>;
  /**
  * Decrements the number stored at key by one. If the key does not exist,
  * it is set to 0 before performing the operation. An error is returned if the
  * key contains a value of the wrong type or contains a string that can not
  * be represented as integer. This operation is limited to 64 bit signed integers.
  * - Available since: 1.0.0.
  * - Time complexity: O(1).
  * @param key Key to decrement.
  * @returns The value of the key after decrementing it.
  * @see {@link https://redis.io/commands/decr}
  */
  DECR(key: string): RedisXTransactionCommand<number>;
  /**
  * Set key to hold the string value and set key to timeout after a given number of milliseconds.
  * This command is similar to SETEX, except that the expiration time is specified in milliseconds instead of seconds.
  *
  * - Available since: 2.6.0.
  * - Time complexity: O(1).
  * @deprecated As of Redis version 2.6.12, this command is regarded as deprecated. It can be replaced by SET with the PX argument when migrating or writing new code.
  * @param key Key to set.
  * @param milliseconds Expiration time in milliseconds.
  * @param value Value to set.
  * @returns "OK" if the command was executed successfully.
  * @see {@link https://redis.io/commands/psetex}
  */
  PSETEX(key: string, milliseconds: number, value: string | number): RedisXTransactionCommand<"OK">;
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
  * Insert all the specified values at the tail of the list stored at key.
  *
  * If key does not exist, it is created as empty list before performing the push operation.
  * When key holds a value that is not a list, an error is returned.
  * - Available since: 1.0.0.
  * - Multiple elements are available since Redis 2.4.0.
  * - Time complexity: O(1) for each element added, so O(N) to add N elements when the command is called with multiple arguments.
  * @param key Key to push values to.
  * @param elements An array of elements to add to the list.
  * @returns The length of the list after the push operation.
  * @see {@link https://redis.io/commands/rpush}
  */
  RPUSH(key: string, elements: (string | number)[]): RedisXTransactionCommand<number>;
  /**
  * Insert all the specified values at the tail of the list stored at key.
  *
  * If key does not exist, it is created as empty list before performing the push operation.
  * When key holds a value that is not a list, an error is returned.
  * - Available since: 1.0.0.
  * - Multiple elements are available since Redis 2.4.0.
  * - Time complexity: O(1) for each element added, so O(N) to add N elements when the command is called with multiple arguments.
  * @param key Key to push values to.
  * @param elements Elements to add to the list.
  * @returns The length of the list after the push operation.
  * @see {@link https://redis.io/commands/rpush}
  */
  RPUSH(key: string, ...elements: (string | number)[]): RedisXTransactionCommand<number>;
  /**
  * Removes and returns the first elements of the list stored at key.
  *
  * By default, the command pops a single element from the beginning of the list. When provided
  * with the optional count argument, the reply will consist of up to count elements, depending
  * on the list's length.
  *
  * - Available since: 1.0.0.
  * - Time complexity: O(N) where N is the number of elements returned.
  * @param key The key of the list.
  * @returns The value of the first element, or `null` when key does not exist.
  * @see {@link https://redis.io/commands/lpop}
  */
  LPOP(key: string): RedisXTransactionCommand<string | null>;
  /**
  * Removes and returns the first elements of the list stored at key.
  *
  * By default, the command pops a single element from the beginning of the list. When provided
  * with the optional count argument, the reply will consist of up to count elements, depending
  * on the list's length.
  *
  * - Available since: 6.2.0 (for the count argument).
  * - Time complexity: O(N) where N is the number of elements returned.
  * @param key The key of the list.
  * @param count The number of elements to pop.
  * @returns An array of popped elements, or `null` when key does not exist.
  * @see {@link https://redis.io/commands/lpop}
  */
  LPOP(key: string, count: number): RedisXTransactionCommand<string[] | null>;
  /**
  * Atomically returns and removes the last element (tail) of the list stored at source,
  * and pushes the element at the first element (head) of the list stored at destination.
  *
  * For example: consider source holding the list a,b,c, and destination holding the list x,y,z.
  * Executing RPOPLPUSH results in source holding a,b and destination holding c,x,y,z.
  *
  * If source does not exist, the value nil is returned and no operation is performed.
  * If source and destination are the same, the operation is equivalent to removing the
  * last element from the list and pushing it as first element of the list, so it can be
  * considered as a list rotation command.
  *
  * - Available since: 1.2.0.
  * - Time complexity: O(1).
  * @deprecated As of Redis version 6.2.0, this command is regarded as deprecated. It can be replaced by LMOVE with the RIGHT and LEFT arguments when migrating or writing new code.
  * @param source Source list key.
  * @param destination Destination list key.
  * @returns The element being popped and pushed, or `null` if the source list is empty.
  * @see {@link https://redis.io/commands/rpoplpush}
  */
  RPOPLPUSH(source: string, destination: string): RedisXTransactionCommand<string | null>;
  /**
  * Insert all the specified values at the tail of the list stored at key, only if key already exists and holds a list.
  * In contrary to RPUSH, no operation will be performed when key does not yet exist.
  *
  * - Available since: 2.2.0.
  * - Multiple elements are available since Redis 4.0.0.
  * - Time complexity: O(1) for each element added, so O(N) to add N elements when the command is called with multiple arguments.
  * @param key Key to push values to.
  * @param elements An array of elements to add to the list.
  * @returns The length of the list after the push operation.
  * @see {@link https://redis.io/commands/rpushx}
  */
  RPUSHX(key: string, elements: (string | number)[]): RedisXTransactionCommand<number>;
  /**
  * Insert all the specified values at the tail of the list stored at key, only if key already exists and holds a list.
  * In contrary to RPUSH, no operation will be performed when key does not yet exist.
  *
  * - Available since: 2.2.0.
  * - Multiple elements are available since Redis 4.0.0.
  * - Time complexity: O(1) for each element added, so O(N) to add N elements when the command is called with multiple arguments.
  * @param key Key to push values to.
  * @param elements Elements to add to the list.
  * @returns The length of the list after the push operation.
  * @see {@link https://redis.io/commands/rpushx}
  */
  RPUSHX(key: string, ...elements: (string | number)[]): RedisXTransactionCommand<number>;
  /**
  * Sets the list element at index to element. For more information on the index argument, see LINDEX.
  *
  * An error is returned for out of range indexes.
  *
  * - Available since: 1.0.0.
  * - Time complexity: O(N) where N is the length of the list. Setting either the first or the last element of the list is O(1).
  * @param key The key of the list.
  * @param index The index of the element to set. Can be negative to count from the end of the list.
  * @param element The new value to set.
  * @returns "OK" if successful.
  * @see {@link https://redis.io/commands/lset}
  */
  LSET(key: string, index: number, element: string | number): RedisXTransactionCommand<"OK">;
  /**
  * Removes the first count occurrences of elements equal to element from the list stored at key.
  * The count argument influences the operation in the following ways:
  * - count > 0: Remove elements equal to element moving from head to tail.
  * - count < 0: Remove elements equal to element moving from tail to head.
  * - count = 0: Remove all elements equal to element.
  *
  * - Available since: 1.0.0.
  * - Time complexity: O(N+M) where N is the length of the list and M is the number of elements removed.
  * @param key The key of the list.
  * @param count The number of occurrences to remove. Use negative values to start from the tail.
  * @param element The element to remove from the list.
  * @returns The number of removed elements.
  * @see {@link https://redis.io/commands/lrem}
  */
  LREM(key: string, count: number, element: string | number): RedisXTransactionCommand<number>;
  /**
  * Insert all the specified elements at the head of the list stored at key.
  *
  * If key does not exist, it is created as empty list before performing the push operations.
  * - Available since: 1.0.0.
  * - Multiple field/value pairs are available since Redis 2.4.0.
  * - Time complexity: O(1) for each element added.
  * @param key Key of the list.
  * @param elements An array of elements to add to the list.
  * @returns The length of the list after the push operation.
  * @see {@link https://redis.io/commands/lpush}
  */
  LPUSH(key: string, elements: (string | number)[]): RedisXTransactionCommand<number>;
  /**
  * Insert all the specified elements at the head of the list stored at key.
  *
  * If key does not exist, it is created as empty list before performing the push operations.
  * - Available since: 1.0.0.
  * - Multiple field/value pairs are available since Redis 2.4.0.
  * - Time complexity: O(1) for each element added.
  * @param key Key of the list.
  * @param elements Elements to add to the list.
  * @returns The length of the list after the push operation.
  * @see {@link https://redis.io/commands/lpush}
  */
  LPUSH(key: string, ...elements: (string | number)[]): RedisXTransactionCommand<number>;
  /**
  * Inserts specified values at the head of the list stored at key, only if key already exists and holds a list.
  * In contrary to LPUSH, no operation will be performed when key does not yet exist.
  *
  * - Available since: 2.2.0.
  * - Time complexity: O(1) for each element added, so O(N) to add N elements when the command is called with multiple arguments.
  * @param key Key of the list.
  * @param elements Element or array of elements to push to the list.
  * @returns The length of the list after the push operation.
  * @see {@link https://redis.io/commands/lpushx}
  */
  LPUSHX(key: string, elements: (string | number)[]): RedisXTransactionCommand<number>;
  /**
  * Inserts specified values at the head of the list stored at key, only if key already exists and holds a list.
  * In contrary to LPUSH, no operation will be performed when key does not yet exist.
  *
  * - Available since: 2.2.0.
  * - Time complexity: O(1) for each element added, so O(N) to add N elements when the command is called with multiple arguments.
  * @param key Key of the list.
  * @param elements One or more elements to push to the list.
  * @returns The length of the list after the push operation.
  * @see {@link https://redis.io/commands/lpushx}
  */
  LPUSHX(key: string, ...elements: (string | number)[]): RedisXTransactionCommand<number>;
  /**
  * Removes and returns the last elements of the list stored at key.
  *
  * By default, the command pops a single element from the end of the list.
  * When provided with the optional count argument, the reply will consist
  * of up to count elements, depending on the list's length.
  *
  * - Available since: 1.0.0.
  * - Time complexity: O(N) where N is the number of elements returned.
  * @param key The key of the list.
  * @returns The value of the last element, or `null` when key does not exist.
  * @see {@link https://redis.io/commands/rpop}
  */
  RPOP(key: string): RedisXTransactionCommand<string | null>;
  /**
  * Removes and returns the last elements of the list stored at key.
  *
  * By default, the command pops a single element from the end of the list.
  * When provided with the optional count argument, the reply will consist
  * of up to count elements, depending on the list's length.
  *
  * - Available since: 6.2.0 (for the count argument).
  * - Time complexity: O(N) where N is the number of elements returned.
  * @param key The key of the list.
  * @param count The number of elements to pop.
  * @returns Array of popped elements, or `null` when key does not exist.
  * @see {@link https://redis.io/commands/rpop}
  */
  RPOP(key: string, count: number): RedisXTransactionCommand<string[] | null>;
  /**
  * Returns the specified elements of the list stored at key. The offsets start and stop
  * are zero-based indexes, with 0 being the first element of the list (the head of the list),
  * 1 being the next element and so on.
  *
  * These offsets can also be negative numbers indicating offsets starting at the end of the list.
  * For example, -1 is the last element of the list, -2 the penultimate, and so on.
  *
  * Out of range indexes will not produce an error. If start is larger than the end of the list,
  * an empty list is returned. If stop is larger than the actual end of the list, Redis will
  * treat it like the last element of the list.
  *
  * - Available since: 1.0.0.
  * - Time complexity: O(S+N) where S is the distance of start offset from HEAD for small lists,
  *   from nearest end (HEAD or TAIL) for large lists; and N is the number of elements in the specified range.
  * @param key The key of the list.
  * @param start The starting position (inclusive, 0-based index).
  * @param stop The ending position (inclusive, 0-based index).
  * @returns Array of elements in the specified range, or an empty array if the key doesn't exist.
  * @see {@link https://redis.io/commands/lrange}
  */
  LRANGE(key: string, start: number, stop: number): RedisXTransactionCommand<string[]>;
  /**
  * Returns the length of the list stored at key. If key does not exist, it is interpreted as an empty list and 0 is returned.
  * An error is returned when the value stored at key is not a list.
  *
  * - Available since: 1.0.0.
  * - Time complexity: O(1).
  * @param key Key to get the length of the list for.
  * @returns The length of the list at key.
  * @see {@link https://redis.io/commands/llen}
  */
  LLEN(key: string): RedisXTransactionCommand<number>;
  /**
  * Inserts element in the list stored at key either before or after the reference value.
  *
  * - Available since: 2.2.0.
  * - Time complexity: O(N) where N is the number of elements to traverse before seeing the value pivot.
  *   This means that inserting somewhere on the left end on the list (head) can be considered O(1)
  *   and inserting somewhere on the right end (tail) is O(N).
  * @param key Key of the list.
  * @param element Element to insert.
  * @param options Command options.
  * @returns The length of the list after the insert operation, or 0 when the key doesn't exist, or -1 when the pivot wasn't found.
  * @see {@link https://redis.io/commands/linsert}
  */
  LINSERT(key: string, element: string | number, options: {
    BEFORE: string | number;
  } | {
    AFTER: string | number;
  }): RedisXTransactionCommand<number>;
  /**
  * Trim an existing list so that it will contain only the specified range of elements specified.
  * Both `start` and `stop` are zero-based indexes, where 0 is the first element of the list (the head),
  * 1 the next element and so on.
  *
  * `start` and `stop` can also be negative numbers indicating offsets from the end of the list,
  * where -1 is the last element of the list, -2 the penultimate element and so on.
  *
  * Out of range indexes will not produce an error: if `start` is larger than the end of the list,
  * or `start` > `stop`, the result will be an empty list (which causes key to be removed).
  * If `stop` is larger than the end of the list, Redis will treat it like the last element of the list.
  *
  * - Available since: 1.0.0.
  * - Time complexity: O(N) where N is the number of elements to be removed by the operation.
  * @param key The key of the list to trim.
  * @param start Zero-based index of the first element to keep.
  * @param stop Zero-based index of the last element to keep.
  * @returns "OK"
  * @see {@link https://redis.io/commands/ltrim}
  */
  LTRIM(key: string, start: number, stop: number): RedisXTransactionCommand<"OK">;
  /**
  * Returns the element at index in the list stored at key.
  * The index is zero-based, so 0 means the first element, 1 the second element and so on.
  * Negative indices can be used to designate elements starting at the tail of the list.
  *
  * - Available since: 1.0.0.
  * - Time complexity: O(N) where N is the number of elements to traverse to get to the element at index. This makes asking for the first or the last element of the list O(1).
  * @param key Key of the list.
  * @param index Zero-based index of the element to return.
  * @returns The requested element, or `null` when index is out of range.
  * @see {@link https://redis.io/commands/lindex}
  */
  LINDEX(key: string, index: number): RedisXTransactionCommand<string | null>;
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
  * Returns all values in the hash stored at key.
  * - Available since: 2.0.0.
  * - Time complexity: O(N) where N is the size of the hash.
  * @param key The key of the hash.
  * @returns A set of values in the hash, or an empty set when the key does not exist.
  * @see {@link https://redis.io/commands/hvals}
  */
  HVALS(key: string): RedisXTransactionCommand<Set<string>>;
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
  * Increment the specified field of a hash stored at key, and representing a floating point number, by the specified increment.
  * If the increment value is negative, the result is to have the hash field value decremented instead of incremented.
  * If the field does not exist, it is set to 0 before performing the operation.
  *
  * - Available since: 2.6.0.
  * - Time complexity: O(1).
  * @param key Key of the hash.
  * @param field Field in the hash to increment.
  * @param increment The increment value (can be negative for decrementing).
  * @returns The value of the field after the increment operation as a string representing the floating point value.
  * @see {@link https://redis.io/commands/hincrbyfloat}
  */
  HINCRBYFLOAT(key: string, field: string | number, increment: number): RedisXTransactionCommand<string>;
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
  * Sets the specified fields to their respective values in the hash stored at key.
  * This command overwrites any specified fields already existing in the hash.
  * If key does not exist, a new key holding a hash is created.
  *
  * - Available since: 2.0.0.
  * - Time complexity: O(N) where N is the number of fields being set.
  * @deprecated As of Redis version 4.0.0, this command is regarded as deprecated. It can be replaced by HSET with multiple field-value pairs when migrating or writing new code.
  * @param key Key that contains the hash.
  * @param field Field to set.
  * @param value Value to set.
  * @returns Simple string reply: "OK".
  * @see {@link https://redis.io/commands/hmset}
  */
  HMSET(key: string, field: string, value: string | number): RedisXTransactionCommand<"OK">;
  /**
  * Sets the specified fields to their respective values in the hash stored at key.
  * This command overwrites any specified fields already existing in the hash.
  * If key does not exist, a new key holding a hash is created.
  *
  * - Available since: 2.0.0.
  * - Time complexity: O(N) where N is the number of fields being set.
  * @deprecated As of Redis version 4.0.0, this command is regarded as deprecated. It can be replaced by HSET with multiple field-value pairs when migrating or writing new code.
  * @param key Key that contains the hash.
  * @param pairs Object containing field/value pairs to set.
  * @returns Simple string reply: "OK".
  * @see {@link https://redis.io/commands/hmset}
  */
  HMSET(key: string, pairs: Record<string, string | number>): RedisXTransactionCommand<"OK">;
  /**
  * Returns the values associated with the specified fields in the hash stored at key.
  *
  * For every field that does not exist in the hash, a nil value is returned.
  * Because non-existing keys are treated as empty hashes, running HMGET against a non-existing key will return a list of nil values.
  *
  * - Available since: 2.0.0.
  * - Time complexity: O(N) where N is the number of fields being requested.
  * @param key Key holding the hash.
  * @param fields Fields to get.
  * @returns Array of values associated with the given fields, in the same order as they are requested.
  * @see {@link https://redis.io/commands/hmget}
  */
  HMGET(key: string, fields: string[]): RedisXTransactionCommand<(string | null)[]>;
  /**
  * Returns the values associated with the specified fields in the hash stored at key.
  *
  * For every field that does not exist in the hash, a nil value is returned.
  * Because non-existing keys are treated as empty hashes, running HMGET against a non-existing key will return a list of nil values.
  *
  * - Available since: 2.0.0.
  * - Time complexity: O(N) where N is the number of fields being requested.
  * @param key Key holding the hash.
  * @param fields Fields to get.
  * @returns Array of values associated with the given fields, in the same order as they are requested.
  * @see {@link https://redis.io/commands/hmget}
  */
  HMGET(key: string, ...fields: string[]): RedisXTransactionCommand<(string | null)[]>;
  /**
  * Returns the number of fields contained in the hash stored at key.
  *
  * - Available since: 2.0.0.
  * - Time complexity: O(1).
  * @param key Key to get hash length.
  * @returns The number of fields in the hash, or 0 when the key does not exist.
  * @see {@link https://redis.io/commands/hlen}
  */
  HLEN(key: string): RedisXTransactionCommand<number>;
  /**
  * Returns all field names in the hash stored at key.
  *
  * - Available since: 2.0.0.
  * - Time complexity: O(N) where N is the size of the hash.
  * @param key The key of the hash.
  * @returns A set of fields in the hash, or an empty set when the key does not exist.
  * @see {@link https://redis.io/commands/hkeys}
  */
  HKEYS(key: string): RedisXTransactionCommand<Set<string>>;
  /**
  * Increments the number stored at field in the hash stored at key by increment.
  * If key does not exist, a new key holding a hash is created. If field does not
  * exist the value is set to 0 before the operation is performed.
  *
  * The range of values supported by HINCRBY is limited to 64 bit signed integers.
  *
  * - Available since: 2.0.0.
  * - Time complexity: O(1).
  * @param key Key of the hash.
  * @param field Field in the hash to increment.
  * @param increment The increment value (can be negative for decrementing).
  * @returns The value of the field after the increment operation.
  * @see {@link https://redis.io/commands/hincrby}
  */
  HINCRBY(key: string, field: string | number, increment: number): RedisXTransactionCommand<number>;
  /**
  * Removes the specified fields from the hash stored at key. Specified fields that do not exist within this hash are ignored.
  * Deletes the hash if no fields remain. If key does not exist, it is treated as an empty hash and this command returns 0.
  *
  * - Available since: 2.0.0. Multiple field arguments support added in 2.4.0.
  * - Time complexity: O(N) where N is the number of fields to be removed.
  * @param key Key of the hash.
  * @param fields Field to remove from the hash.
  * @returns The number of fields that were removed from the hash, excluding specified but non-existing fields.
  * @see {@link https://redis.io/commands/hdel}
  */
  HDEL(key: string, fields: (string | number)[]): RedisXTransactionCommand<number>;
  /**
  * Removes the specified fields from the hash stored at key. Specified fields that do not exist within this hash are ignored.
  * Deletes the hash if no fields remain. If key does not exist, it is treated as an empty hash and this command returns 0.
  *
  * - Available since: 2.0.0. Multiple field arguments support added in 2.4.0.
  * - Time complexity: O(N) where N is the number of fields to be removed.
  * @param key Key of the hash.
  * @param fields Fields to remove from the hash.
  * @returns The number of fields that were removed from the hash, excluding specified but non-existing fields.
  * @see {@link https://redis.io/commands/hdel}
  */
  HDEL(key: string, ...fields: (string | number)[]): RedisXTransactionCommand<number>;
  /**
  * Returns the string length of the value associated with field in the hash stored at key.
  * If the key or the field do not exist, 0 is returned.
  *
  * - Available since: 3.2.0.
  * - Time complexity: O(1).
  * @param key The key of the hash.
  * @param field The field in the hash.
  * @returns The string length of the value associated with the field, or zero when the field isn't present in the hash or the key doesn't exist at all.
  * @see {@link https://redis.io/commands/hstrlen}
  */
  HSTRLEN(key: string, field: string): RedisXTransactionCommand<number>;
  /**
  * Returns if field is an existing field in the hash stored at key.
  *
  * - Available since: 2.0.0.
  * - Time complexity: O(1).
  * @param key Key of the hash.
  * @param field Field to check in the hash.
  * @returns Returns `true` if the hash contains the field. Returns `false` if the hash does not contain the field, or the key does not exist.
  * @see {@link https://redis.io/commands/hexists}
  */
  HEXISTS(key: string, field: string | number): RedisXTransactionCommand<boolean>;
  /**
  * Sets field in the hash stored at key to value, only if field does not yet exist.
  * If key does not exist, a new key holding a hash is created.
  * If field already exists, this operation has no effect.
  *
  * - Available since: 2.0.0.
  * - Time complexity: O(1).
  * @param key The key of the hash.
  * @param field The field to set.
  * @param value The value to set.
  * @returns Returns `true` if the field is new and the value was set. Returns `false` if the field already exists and no operation was performed.
  * @see {@link https://redis.io/commands/hsetnx}
  */
  HSETNX(key: string, field: string, value: string | number): RedisXTransactionCommand<boolean>;
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
  * Remove the specified members from the set stored at key.
  * Specified members that are not a member of this set are ignored.
  * If key does not exist, it is treated as an empty set and this command returns 0.
  *
  * - Available since: 1.0.0. Multiple members support added in 2.4.0.
  * - Time complexity: O(N) where N is the number of members to be removed.
  * @param key Key of the set.
  * @param member Member to remove from the set.
  * @returns The number of members that were removed from the set, not including non existing members.
  * @see {@link https://redis.io/commands/srem}
  */
  SREM(key: string, member: (string | number)[]): RedisXTransaction<AddToList<L, number>, C, D>;
  /**
  * Remove the specified members from the set stored at key.
  * Specified members that are not a member of this set are ignored.
  * If key does not exist, it is treated as an empty set and this command returns 0.
  *
  * - Available since: 1.0.0. Multiple members support added in 2.4.0.
  * - Time complexity: O(N) where N is the number of members to be removed.
  * @param key Key of the set.
  * @param members Members to remove from the set.
  * @returns The number of members that were removed from the set, not including non existing members.
  * @see {@link https://redis.io/commands/srem}
  */
  SREM(key: string, ...members: (string | number)[]): RedisXTransaction<AddToList<L, number>, C, D>;
  /**
  * Returns whether each member is a member of the set stored at key.
  *
  * For every member, `true` is returned if the value is a member of the set,
  * or `false` if the element is not a member of the set or if key does not exist.
  *
  * - Available since: 6.2.0.
  * - Time complexity: O(N) where N is the number of elements being checked for membership.
  * @param key The key of the set.
  * @param members The members to check.
  * @returns An array of booleans, representing the membership of the given elements in the same order as they are requested.
  * @see {@link https://redis.io/commands/smismember}
  */
  SMISMEMBER(key: string, ...members: string[]): RedisXTransaction<AddToList<L, boolean[]>, C, D>;
  /**
  * Returns all the members of the set value stored at key.
  *
  * - Available since: 1.0.0.
  * - Time complexity: O(N) where N is the set cardinality.
  * @param key The key of the set.
  * @returns A set with all the members of the set.
  * @see {@link https://redis.io/commands/smembers}
  */
  SMEMBERS(key: string): RedisXTransaction<AddToList<L, Set<string>>, C, D>;
  /**
  * Returns if member is a member of the set stored at key.
  *
  * - Available since: 1.0.0.
  * - Time complexity: O(1).
  * @param key The key of the set.
  * @param member The member to check.
  * @returns `true` if the member is a member of the set stored at key, `false` otherwise.
  * @see {@link https://redis.io/commands/sismember}
  */
  SISMEMBER(key: string, member: string): RedisXTransaction<AddToList<L, boolean>, C, D>;
  /**
  * Returns the set cardinality (number of elements) of the set stored at key.
  *
  * - Available since: 1.0.0.
  * - Time complexity: O(1).
  * @param key The key of the set.
  * @returns The cardinality (number of elements) of the set, or `0` if the key does not exist.
  * @see {@link https://redis.io/commands/scard}
  */
  SCARD(key: string): RedisXTransaction<AddToList<L, number>, C, D>;
  /**
  * Add the specified members to the set stored at key.
  * Specified members that are already a member of this set are ignored.
  * If key does not exist, a new set is created before adding the specified members.
  *
  * An error is returned when the value stored at key is not a set.
  *
  * - Available since: 1.0.0. Multiple members support added in 2.4.0.
  * - Time complexity: O(1) for each element added.
  * @param key Key of the set.
  * @param member Member to add to the set.
  * @returns The number of elements that were added to the set, not including all the elements already present in the set.
  * @see {@link https://redis.io/commands/sadd}
  */
  SADD(key: string, member: (string | number)[]): RedisXTransaction<AddToList<L, number>, C, D>;
  /**
  * Add the specified members to the set stored at key.
  * Specified members that are already a member of this set are ignored.
  * If key does not exist, a new set is created before adding the specified members.
  *
  * An error is returned when the value stored at key is not a set.
  *
  * - Available since: 1.0.0. Multiple members support added in 2.4.0.
  * - Time complexity: O(1) for each element added.
  * @param key Key of the set.
  * @param members Members to add to the set.
  * @returns The number of elements that were added to the set, not including all the elements already present in the set.
  * @see {@link https://redis.io/commands/sadd}
  */
  SADD(key: string, ...members: (string | number)[]): RedisXTransaction<AddToList<L, number>, C, D>;
  /**
  * Sets the given keys to their respective values. MSETNX will not perform
  * any operation at all even if just a single key already exists.
  *
  * - Available since: 1.0.1.
  * - Time complexity: O(N) where N is the number of keys to set.
  * @param pairs A record of key-value pairs.
  * @returns `true` if all the keys were set, `false` if no key was set (at least one key already existed).
  * @see {@link https://redis.io/commands/msetnx}
  */
  MSETNX(pairs: Record<string, string | number>): RedisXTransaction<AddToList<L, boolean>, C, D>;
  /**
  * Set key to hold string value if key does not exist. In that case, it is equal to SET.
  * When key already holds a value, no operation is performed. SETNX is short for "SET if Not eXists".
  *
  * - Available since: 1.0.0.
  * - Time complexity: O(1).
  * @deprecated As of Redis version 2.6.12, this command is regarded as deprecated. It can be replaced by SET with the NX argument when migrating or writing new code.
  * @param key Key to set.
  * @param value Value to set.
  * @returns Integer reply: 1 if the key was set, 0 if the key was not set.
  * @see {@link https://redis.io/commands/setnx}
  */
  SETNX(key: string, value: string | number): RedisXTransaction<AddToList<L, boolean>, C, D>;
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
  * Append a value to a key.
  *
  * If key already exists and is a string, this command appends the value at the end of the string.
  * If key does not exist it is created and set as an empty string, so APPEND will be similar to SET in this special case.
  * - Available since: 2.0.0.
  * - Time complexity: O(1). The amortized time complexity is O(1) assuming the appended value is small and the already present value is of any size, since the dynamic string library used by Redis will double the free space available on every reallocation.
  * @param key Key to append to.
  * @param value Value to append.
  * @returns The length of the string after the append operation.
  * @see {@link https://redis.io/commands/append}
  */
  APPEND(key: string, value: string): RedisXTransaction<AddToList<L, number>, C, D>;
  /**
  * Increments the number stored at key by one. If the key does not exist,
  * it is set to 0 before performing the operation. An error is returned if the
  * key contains a value of the wrong type or contains a string that can not
  * be represented as integer. This operation is limited to 64 bit signed integers.
  * - Available since: 1.0.0.
  * - Time complexity: O(1).
  * @param key Key to increment.
  * @returns The value of the key after incrementing it.
  * @see {@link https://redis.io/commands/incr}
  */
  INCR(key: string): RedisXTransaction<AddToList<L, number>, C, D>;
  /**
  * Increment the string representing a floating point number stored at key by the specified increment.
  * By using a negative increment value, the result is that the value stored at the key is decremented.
  * If the key does not exist, it is set to 0 before performing the operation.
  *
  * - Available since: 2.6.0.
  * - Time complexity: O(1).
  * @param key Key to increment.
  * @param increment Value to increment by.
  * @returns The value of key after the increment.
  * @see {@link https://redis.io/commands/incrbyfloat}
  */
  INCRBYFLOAT(key: string, increment: number): RedisXTransaction<AddToList<L, string>, C, D>;
  /**
  * Returns the values of all specified keys. For every key that does not hold a
  * string value or does not exist, the special value `null` is returned.
  * Because of this, the operation never fails.
  *
  * - Available since: 1.0.0.
  * - Time complexity: O(N) where N is the number of keys to retrieve.
  * @param keys The keys to get.
  * @returns Array reply: a list of values at the specified keys.
  * @see {@link https://redis.io/commands/mget}
  */
  MGET<const K extends string[]>(keys: K): RedisXTransaction<AddToList<L, { [I in keyof K]: string | null }>, C, D>;
  /**
  * Returns the values of all specified keys. For every key that does not hold a
  * string value or does not exist, the special value `null` is returned.
  * Because of this, the operation never fails.
  *
  * - Available since: 1.0.0.
  * - Time complexity: O(N) where N is the number of keys to retrieve.
  * @param keys The keys to get.
  * @returns Array reply: a list of values at the specified keys.
  * @see {@link https://redis.io/commands/mget}
  */
  MGET<const K extends string[]>(...keys: K): RedisXTransaction<AddToList<L, { [I in keyof K]: string | null }>, C, D>;
  /**
  * Get the value of key and delete the key. This command is similar to GET, except for the fact
  * that it also deletes the key on success (if and only if the key's value type is a string).
  *
  * - Available since: 6.2.0.
  * - Time complexity: O(1).
  * @param key Key to get and delete.
  * @returns The value of key, or `null` when key does not exist or its value is not a string.
  * @see {@link https://redis.io/commands/getdel}
  */
  GETDEL(key: string): RedisXTransaction<AddToList<L, string | null>, C, D>;
  /**
  * Sets the given keys to their respective values. MSET replaces existing values with new values, just as regular SET.
  * MSET is atomic, so all given keys are set at once. It is not possible for clients to see that some of the keys were updated while others are unchanged.
  * - Available since: 1.0.1.
  * - Time complexity: O(N) where N is the number of keys to set.
  * @param pairs A record of key-value pairs.
  * @returns "OK"
  * @see {@link https://redis.io/commands/mset}
  */
  MSET(pairs: Record<string, string | number>): RedisXTransaction<AddToList<L, "OK">, C, D>;
  /**
  * Increments the number stored at key by increment. If the key does not exist, it is set to 0 before performing the operation.
  * An error is returned if the key contains a value of the wrong type or contains a string that cannot be represented as integer.
  * This operation is limited to 64 bit signed integers.
  *
  * - Available since: 1.0.0.
  * - Time complexity: O(1).
  * @param key Key to increment.
  * @param increment Amount to increment by.
  * @returns The value of the key after the increment.
  * @see {@link https://redis.io/commands/incrby}
  */
  INCRBY(key: string, increment: number): RedisXTransaction<AddToList<L, number>, C, D>;
  /**
  * Overwrites part of the string stored at key, starting at the specified offset, for the entire length of value.
  * If the offset is larger than the current length of the string at key, the string is padded with zero-bytes to make offset fit.
  * Non-existing keys are considered as empty strings, so this command will make sure it holds a string large enough to be able to set value at offset.
  *
  * Note that the maximum offset that you can set is `2^29-1` (536870911), as Redis Strings are limited to 512 megabytes.
  *
  * - Available since: 2.2.0.
  * - Time complexity: O(1), not counting the time taken to copy the new string in place. Usually, this string is very small so the amortized complexity is O(1). Otherwise, complexity is O(M) with M being the length of the value argument.
  * @param key Key to modify.
  * @param offset Position at which the overwrite should begin.
  * @param value String that will be written to the key, starting at the specified offset.
  * @returns The length of the string after it was modified by the command.
  * @see {@link https://redis.io/commands/setrange}
  */
  SETRANGE(key: string, offset: number, value: string): RedisXTransaction<AddToList<L, number>, C, D>;
  /**
  * Returns the substring of the string value stored at key, determined by the offsets start and end (both are inclusive).
  * Negative offsets can be used in order to provide an offset starting from the end of the string.
  * So -1 means the last character, -2 the penultimate and so forth.
  * - Available since: 1.0.0.
  * - Time complexity: O(N) where N is the length of the returned string. The complexity is ultimately determined by the returned length, but because creating a substring from an existing string is very cheap, it can be considered O(1) for small strings.
  * @deprecated As of Redis version 2.0.0, this command is regarded as deprecated. It can be replaced by GETRANGE when migrating or writing new code.
  * @param key Key to get the substring from.
  * @param start Start offset (inclusive).
  * @param end End offset (inclusive).
  * @returns The substring of the string value stored at key.
  * @see {@link https://redis.io/commands/substr}
  */
  SUBSTR(key: string, start: number, end: number): RedisXTransaction<AddToList<L, string>, C, D>;
  /**
  * Atomically sets key to value and returns the old value stored at key.
  * Returns an error when key exists but does not hold a string value.
  * Any previous time to live associated with the key is discarded on successful SET operation.
  *
  * - Available since: 1.0.0.
  * - Time complexity: O(1).
  * @deprecated As of Redis version 6.2.0, this command is regarded as deprecated. It can be replaced by SET with the GET argument when migrating or writing new code.
  * @param key Key to set.
  * @param value Value to set.
  * @returns The old value stored at key, or `null` if key did not exist.
  * @see {@link https://redis.io/commands/getset}
  */
  GETSET(key: string, value: string | number): RedisXTransaction<AddToList<L, string | null>, C, D>;
  /**
  * Reduces the value stored at the specified key by the specified decrement.
  * If the key does not exist, it is initialized with a value of 0 before performing the operation.
  * If the key's value is not of the correct type or cannot be represented as an integer, an error is returned.
  * This operation is limited to 64-bit signed integers.
  *
  * - Available since: 1.0.0.
  * - Time complexity: O(1).
  * @param key Key to decrement.
  * @param decrement The value to decrement by.
  * @returns The value of the key after decrementing it.
  * @see {@link https://redis.io/commands/decrby}
  */
  DECRBY(key: string, decrement: number): RedisXTransaction<AddToList<L, number>, C, D>;
  /**
  * Returns the substring of the string value stored at key, determined by the offsets start and end (both are inclusive).
  * Negative offsets can be used in order to provide an offset starting from the end of the string.
  * So -1 means the last character, -2 the penultimate and so forth.
  *
  * The function handles out of range requests by limiting the resulting range to the actual length of the string.
  * - Available since: 2.4.0.
  * - Time complexity: O(N) where N is the length of the returned string. The complexity is ultimately determined by the returned length, but because creating a substring from an existing string is very cheap, it can be considered O(1) for small strings.
  * @param key The key holding the string value.
  * @param start The starting offset. Can be negative to count from the end of the string.
  * @param end The ending offset (inclusive). Can be negative to count from the end of the string.
  * @returns The substring.
  * @see {@link https://redis.io/commands/getrange}
  */
  GETRANGE(key: string, start: number, end: number): RedisXTransaction<AddToList<L, string>, C, D>;
  /**
  * Set key to hold the string value and set key to timeout after a given number of seconds.
  * This command is equivalent to SET key value EX seconds.
  *
  * - Available since: 2.0.0.
  * - Time complexity: O(1).
  * @deprecated As of Redis version 2.6.12, this command is regarded as deprecated. It can be replaced by SET with the EX argument when migrating or writing new code.
  * @param key Key to set.
  * @param seconds Timeout in seconds.
  * @param value Value to set.
  * @returns Simple string reply: OK.
  * @see {@link https://redis.io/commands/setex}
  */
  SETEX(key: string, seconds: number, value: string | number): RedisXTransaction<AddToList<L, "OK">, C, D>;
  /**
  * Get the value of key and optionally set its expiration.
  * GETEX is similar to GET, but is a write command with additional options.
  *
  * An error is returned if the value stored at key is not a string, because GETEX only handles string values.
  * - Available since: 6.2.0.
  * - Time complexity: O(1).
  * @param key Key to get.
  * @param options Command options.
  * @returns The value of key, or `null` when key does not exist.
  * @see {@link https://redis.io/commands/getex}
  */
  GETEX(key: string, options?: GetexOptions): RedisXTransaction<AddToList<L, string | null>, C, D>;
  /**
  * Returns the length of the string value stored at key.
  * An error is returned when key holds a non-string value.
  *
  * - Available since: 2.2.0.
  * - Time complexity: O(1).
  * @param key Key to get length of.
  * @returns The length of the string stored at key, or 0 when the key does not exist.
  * @see {@link https://redis.io/commands/strlen}
  */
  STRLEN(key: string): RedisXTransaction<AddToList<L, number>, C, D>;
  /**
  * Decrements the number stored at key by one. If the key does not exist,
  * it is set to 0 before performing the operation. An error is returned if the
  * key contains a value of the wrong type or contains a string that can not
  * be represented as integer. This operation is limited to 64 bit signed integers.
  * - Available since: 1.0.0.
  * - Time complexity: O(1).
  * @param key Key to decrement.
  * @returns The value of the key after decrementing it.
  * @see {@link https://redis.io/commands/decr}
  */
  DECR(key: string): RedisXTransaction<AddToList<L, number>, C, D>;
  /**
  * Set key to hold the string value and set key to timeout after a given number of milliseconds.
  * This command is similar to SETEX, except that the expiration time is specified in milliseconds instead of seconds.
  *
  * - Available since: 2.6.0.
  * - Time complexity: O(1).
  * @deprecated As of Redis version 2.6.12, this command is regarded as deprecated. It can be replaced by SET with the PX argument when migrating or writing new code.
  * @param key Key to set.
  * @param milliseconds Expiration time in milliseconds.
  * @param value Value to set.
  * @returns "OK" if the command was executed successfully.
  * @see {@link https://redis.io/commands/psetex}
  */
  PSETEX(key: string, milliseconds: number, value: string | number): RedisXTransaction<AddToList<L, "OK">, C, D>;
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
  * Insert all the specified values at the tail of the list stored at key.
  *
  * If key does not exist, it is created as empty list before performing the push operation.
  * When key holds a value that is not a list, an error is returned.
  * - Available since: 1.0.0.
  * - Multiple elements are available since Redis 2.4.0.
  * - Time complexity: O(1) for each element added, so O(N) to add N elements when the command is called with multiple arguments.
  * @param key Key to push values to.
  * @param elements An array of elements to add to the list.
  * @returns The length of the list after the push operation.
  * @see {@link https://redis.io/commands/rpush}
  */
  RPUSH(key: string, elements: (string | number)[]): RedisXTransaction<AddToList<L, number>, C, D>;
  /**
  * Insert all the specified values at the tail of the list stored at key.
  *
  * If key does not exist, it is created as empty list before performing the push operation.
  * When key holds a value that is not a list, an error is returned.
  * - Available since: 1.0.0.
  * - Multiple elements are available since Redis 2.4.0.
  * - Time complexity: O(1) for each element added, so O(N) to add N elements when the command is called with multiple arguments.
  * @param key Key to push values to.
  * @param elements Elements to add to the list.
  * @returns The length of the list after the push operation.
  * @see {@link https://redis.io/commands/rpush}
  */
  RPUSH(key: string, ...elements: (string | number)[]): RedisXTransaction<AddToList<L, number>, C, D>;
  /**
  * Removes and returns the first elements of the list stored at key.
  *
  * By default, the command pops a single element from the beginning of the list. When provided
  * with the optional count argument, the reply will consist of up to count elements, depending
  * on the list's length.
  *
  * - Available since: 1.0.0.
  * - Time complexity: O(N) where N is the number of elements returned.
  * @param key The key of the list.
  * @returns The value of the first element, or `null` when key does not exist.
  * @see {@link https://redis.io/commands/lpop}
  */
  LPOP(key: string): RedisXTransaction<AddToList<L, string | null>, C, D>;
  /**
  * Removes and returns the first elements of the list stored at key.
  *
  * By default, the command pops a single element from the beginning of the list. When provided
  * with the optional count argument, the reply will consist of up to count elements, depending
  * on the list's length.
  *
  * - Available since: 6.2.0 (for the count argument).
  * - Time complexity: O(N) where N is the number of elements returned.
  * @param key The key of the list.
  * @param count The number of elements to pop.
  * @returns An array of popped elements, or `null` when key does not exist.
  * @see {@link https://redis.io/commands/lpop}
  */
  LPOP(key: string, count: number): RedisXTransaction<AddToList<L, string[] | null>, C, D>;
  /**
  * Atomically returns and removes the last element (tail) of the list stored at source,
  * and pushes the element at the first element (head) of the list stored at destination.
  *
  * For example: consider source holding the list a,b,c, and destination holding the list x,y,z.
  * Executing RPOPLPUSH results in source holding a,b and destination holding c,x,y,z.
  *
  * If source does not exist, the value nil is returned and no operation is performed.
  * If source and destination are the same, the operation is equivalent to removing the
  * last element from the list and pushing it as first element of the list, so it can be
  * considered as a list rotation command.
  *
  * - Available since: 1.2.0.
  * - Time complexity: O(1).
  * @deprecated As of Redis version 6.2.0, this command is regarded as deprecated. It can be replaced by LMOVE with the RIGHT and LEFT arguments when migrating or writing new code.
  * @param source Source list key.
  * @param destination Destination list key.
  * @returns The element being popped and pushed, or `null` if the source list is empty.
  * @see {@link https://redis.io/commands/rpoplpush}
  */
  RPOPLPUSH(source: string, destination: string): RedisXTransaction<AddToList<L, string | null>, C, D>;
  /**
  * Insert all the specified values at the tail of the list stored at key, only if key already exists and holds a list.
  * In contrary to RPUSH, no operation will be performed when key does not yet exist.
  *
  * - Available since: 2.2.0.
  * - Multiple elements are available since Redis 4.0.0.
  * - Time complexity: O(1) for each element added, so O(N) to add N elements when the command is called with multiple arguments.
  * @param key Key to push values to.
  * @param elements An array of elements to add to the list.
  * @returns The length of the list after the push operation.
  * @see {@link https://redis.io/commands/rpushx}
  */
  RPUSHX(key: string, elements: (string | number)[]): RedisXTransaction<AddToList<L, number>, C, D>;
  /**
  * Insert all the specified values at the tail of the list stored at key, only if key already exists and holds a list.
  * In contrary to RPUSH, no operation will be performed when key does not yet exist.
  *
  * - Available since: 2.2.0.
  * - Multiple elements are available since Redis 4.0.0.
  * - Time complexity: O(1) for each element added, so O(N) to add N elements when the command is called with multiple arguments.
  * @param key Key to push values to.
  * @param elements Elements to add to the list.
  * @returns The length of the list after the push operation.
  * @see {@link https://redis.io/commands/rpushx}
  */
  RPUSHX(key: string, ...elements: (string | number)[]): RedisXTransaction<AddToList<L, number>, C, D>;
  /**
  * Sets the list element at index to element. For more information on the index argument, see LINDEX.
  *
  * An error is returned for out of range indexes.
  *
  * - Available since: 1.0.0.
  * - Time complexity: O(N) where N is the length of the list. Setting either the first or the last element of the list is O(1).
  * @param key The key of the list.
  * @param index The index of the element to set. Can be negative to count from the end of the list.
  * @param element The new value to set.
  * @returns "OK" if successful.
  * @see {@link https://redis.io/commands/lset}
  */
  LSET(key: string, index: number, element: string | number): RedisXTransaction<AddToList<L, "OK">, C, D>;
  /**
  * Removes the first count occurrences of elements equal to element from the list stored at key.
  * The count argument influences the operation in the following ways:
  * - count > 0: Remove elements equal to element moving from head to tail.
  * - count < 0: Remove elements equal to element moving from tail to head.
  * - count = 0: Remove all elements equal to element.
  *
  * - Available since: 1.0.0.
  * - Time complexity: O(N+M) where N is the length of the list and M is the number of elements removed.
  * @param key The key of the list.
  * @param count The number of occurrences to remove. Use negative values to start from the tail.
  * @param element The element to remove from the list.
  * @returns The number of removed elements.
  * @see {@link https://redis.io/commands/lrem}
  */
  LREM(key: string, count: number, element: string | number): RedisXTransaction<AddToList<L, number>, C, D>;
  /**
  * Insert all the specified elements at the head of the list stored at key.
  *
  * If key does not exist, it is created as empty list before performing the push operations.
  * - Available since: 1.0.0.
  * - Multiple field/value pairs are available since Redis 2.4.0.
  * - Time complexity: O(1) for each element added.
  * @param key Key of the list.
  * @param elements An array of elements to add to the list.
  * @returns The length of the list after the push operation.
  * @see {@link https://redis.io/commands/lpush}
  */
  LPUSH(key: string, elements: (string | number)[]): RedisXTransaction<AddToList<L, number>, C, D>;
  /**
  * Insert all the specified elements at the head of the list stored at key.
  *
  * If key does not exist, it is created as empty list before performing the push operations.
  * - Available since: 1.0.0.
  * - Multiple field/value pairs are available since Redis 2.4.0.
  * - Time complexity: O(1) for each element added.
  * @param key Key of the list.
  * @param elements Elements to add to the list.
  * @returns The length of the list after the push operation.
  * @see {@link https://redis.io/commands/lpush}
  */
  LPUSH(key: string, ...elements: (string | number)[]): RedisXTransaction<AddToList<L, number>, C, D>;
  /**
  * Inserts specified values at the head of the list stored at key, only if key already exists and holds a list.
  * In contrary to LPUSH, no operation will be performed when key does not yet exist.
  *
  * - Available since: 2.2.0.
  * - Time complexity: O(1) for each element added, so O(N) to add N elements when the command is called with multiple arguments.
  * @param key Key of the list.
  * @param elements Element or array of elements to push to the list.
  * @returns The length of the list after the push operation.
  * @see {@link https://redis.io/commands/lpushx}
  */
  LPUSHX(key: string, elements: (string | number)[]): RedisXTransaction<AddToList<L, number>, C, D>;
  /**
  * Inserts specified values at the head of the list stored at key, only if key already exists and holds a list.
  * In contrary to LPUSH, no operation will be performed when key does not yet exist.
  *
  * - Available since: 2.2.0.
  * - Time complexity: O(1) for each element added, so O(N) to add N elements when the command is called with multiple arguments.
  * @param key Key of the list.
  * @param elements One or more elements to push to the list.
  * @returns The length of the list after the push operation.
  * @see {@link https://redis.io/commands/lpushx}
  */
  LPUSHX(key: string, ...elements: (string | number)[]): RedisXTransaction<AddToList<L, number>, C, D>;
  /**
  * Removes and returns the last elements of the list stored at key.
  *
  * By default, the command pops a single element from the end of the list.
  * When provided with the optional count argument, the reply will consist
  * of up to count elements, depending on the list's length.
  *
  * - Available since: 1.0.0.
  * - Time complexity: O(N) where N is the number of elements returned.
  * @param key The key of the list.
  * @returns The value of the last element, or `null` when key does not exist.
  * @see {@link https://redis.io/commands/rpop}
  */
  RPOP(key: string): RedisXTransaction<AddToList<L, string | null>, C, D>;
  /**
  * Removes and returns the last elements of the list stored at key.
  *
  * By default, the command pops a single element from the end of the list.
  * When provided with the optional count argument, the reply will consist
  * of up to count elements, depending on the list's length.
  *
  * - Available since: 6.2.0 (for the count argument).
  * - Time complexity: O(N) where N is the number of elements returned.
  * @param key The key of the list.
  * @param count The number of elements to pop.
  * @returns Array of popped elements, or `null` when key does not exist.
  * @see {@link https://redis.io/commands/rpop}
  */
  RPOP(key: string, count: number): RedisXTransaction<AddToList<L, string[] | null>, C, D>;
  /**
  * Returns the specified elements of the list stored at key. The offsets start and stop
  * are zero-based indexes, with 0 being the first element of the list (the head of the list),
  * 1 being the next element and so on.
  *
  * These offsets can also be negative numbers indicating offsets starting at the end of the list.
  * For example, -1 is the last element of the list, -2 the penultimate, and so on.
  *
  * Out of range indexes will not produce an error. If start is larger than the end of the list,
  * an empty list is returned. If stop is larger than the actual end of the list, Redis will
  * treat it like the last element of the list.
  *
  * - Available since: 1.0.0.
  * - Time complexity: O(S+N) where S is the distance of start offset from HEAD for small lists,
  *   from nearest end (HEAD or TAIL) for large lists; and N is the number of elements in the specified range.
  * @param key The key of the list.
  * @param start The starting position (inclusive, 0-based index).
  * @param stop The ending position (inclusive, 0-based index).
  * @returns Array of elements in the specified range, or an empty array if the key doesn't exist.
  * @see {@link https://redis.io/commands/lrange}
  */
  LRANGE(key: string, start: number, stop: number): RedisXTransaction<AddToList<L, string[]>, C, D>;
  /**
  * Returns the length of the list stored at key. If key does not exist, it is interpreted as an empty list and 0 is returned.
  * An error is returned when the value stored at key is not a list.
  *
  * - Available since: 1.0.0.
  * - Time complexity: O(1).
  * @param key Key to get the length of the list for.
  * @returns The length of the list at key.
  * @see {@link https://redis.io/commands/llen}
  */
  LLEN(key: string): RedisXTransaction<AddToList<L, number>, C, D>;
  /**
  * Inserts element in the list stored at key either before or after the reference value.
  *
  * - Available since: 2.2.0.
  * - Time complexity: O(N) where N is the number of elements to traverse before seeing the value pivot.
  *   This means that inserting somewhere on the left end on the list (head) can be considered O(1)
  *   and inserting somewhere on the right end (tail) is O(N).
  * @param key Key of the list.
  * @param element Element to insert.
  * @param options Command options.
  * @returns The length of the list after the insert operation, or 0 when the key doesn't exist, or -1 when the pivot wasn't found.
  * @see {@link https://redis.io/commands/linsert}
  */
  LINSERT(key: string, element: string | number, options: {
    BEFORE: string | number;
  } | {
    AFTER: string | number;
  }): RedisXTransaction<AddToList<L, number>, C, D>;
  /**
  * Trim an existing list so that it will contain only the specified range of elements specified.
  * Both `start` and `stop` are zero-based indexes, where 0 is the first element of the list (the head),
  * 1 the next element and so on.
  *
  * `start` and `stop` can also be negative numbers indicating offsets from the end of the list,
  * where -1 is the last element of the list, -2 the penultimate element and so on.
  *
  * Out of range indexes will not produce an error: if `start` is larger than the end of the list,
  * or `start` > `stop`, the result will be an empty list (which causes key to be removed).
  * If `stop` is larger than the end of the list, Redis will treat it like the last element of the list.
  *
  * - Available since: 1.0.0.
  * - Time complexity: O(N) where N is the number of elements to be removed by the operation.
  * @param key The key of the list to trim.
  * @param start Zero-based index of the first element to keep.
  * @param stop Zero-based index of the last element to keep.
  * @returns "OK"
  * @see {@link https://redis.io/commands/ltrim}
  */
  LTRIM(key: string, start: number, stop: number): RedisXTransaction<AddToList<L, "OK">, C, D>;
  /**
  * Returns the element at index in the list stored at key.
  * The index is zero-based, so 0 means the first element, 1 the second element and so on.
  * Negative indices can be used to designate elements starting at the tail of the list.
  *
  * - Available since: 1.0.0.
  * - Time complexity: O(N) where N is the number of elements to traverse to get to the element at index. This makes asking for the first or the last element of the list O(1).
  * @param key Key of the list.
  * @param index Zero-based index of the element to return.
  * @returns The requested element, or `null` when index is out of range.
  * @see {@link https://redis.io/commands/lindex}
  */
  LINDEX(key: string, index: number): RedisXTransaction<AddToList<L, string | null>, C, D>;
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
  * Returns all values in the hash stored at key.
  * - Available since: 2.0.0.
  * - Time complexity: O(N) where N is the size of the hash.
  * @param key The key of the hash.
  * @returns A set of values in the hash, or an empty set when the key does not exist.
  * @see {@link https://redis.io/commands/hvals}
  */
  HVALS(key: string): RedisXTransaction<AddToList<L, Set<string>>, C, D>;
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
  * Increment the specified field of a hash stored at key, and representing a floating point number, by the specified increment.
  * If the increment value is negative, the result is to have the hash field value decremented instead of incremented.
  * If the field does not exist, it is set to 0 before performing the operation.
  *
  * - Available since: 2.6.0.
  * - Time complexity: O(1).
  * @param key Key of the hash.
  * @param field Field in the hash to increment.
  * @param increment The increment value (can be negative for decrementing).
  * @returns The value of the field after the increment operation as a string representing the floating point value.
  * @see {@link https://redis.io/commands/hincrbyfloat}
  */
  HINCRBYFLOAT(key: string, field: string | number, increment: number): RedisXTransaction<AddToList<L, string>, C, D>;
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
  * Sets the specified fields to their respective values in the hash stored at key.
  * This command overwrites any specified fields already existing in the hash.
  * If key does not exist, a new key holding a hash is created.
  *
  * - Available since: 2.0.0.
  * - Time complexity: O(N) where N is the number of fields being set.
  * @deprecated As of Redis version 4.0.0, this command is regarded as deprecated. It can be replaced by HSET with multiple field-value pairs when migrating or writing new code.
  * @param key Key that contains the hash.
  * @param field Field to set.
  * @param value Value to set.
  * @returns Simple string reply: "OK".
  * @see {@link https://redis.io/commands/hmset}
  */
  HMSET(key: string, field: string, value: string | number): RedisXTransaction<AddToList<L, "OK">, C, D>;
  /**
  * Sets the specified fields to their respective values in the hash stored at key.
  * This command overwrites any specified fields already existing in the hash.
  * If key does not exist, a new key holding a hash is created.
  *
  * - Available since: 2.0.0.
  * - Time complexity: O(N) where N is the number of fields being set.
  * @deprecated As of Redis version 4.0.0, this command is regarded as deprecated. It can be replaced by HSET with multiple field-value pairs when migrating or writing new code.
  * @param key Key that contains the hash.
  * @param pairs Object containing field/value pairs to set.
  * @returns Simple string reply: "OK".
  * @see {@link https://redis.io/commands/hmset}
  */
  HMSET(key: string, pairs: Record<string, string | number>): RedisXTransaction<AddToList<L, "OK">, C, D>;
  /**
  * Returns the values associated with the specified fields in the hash stored at key.
  *
  * For every field that does not exist in the hash, a nil value is returned.
  * Because non-existing keys are treated as empty hashes, running HMGET against a non-existing key will return a list of nil values.
  *
  * - Available since: 2.0.0.
  * - Time complexity: O(N) where N is the number of fields being requested.
  * @param key Key holding the hash.
  * @param fields Fields to get.
  * @returns Array of values associated with the given fields, in the same order as they are requested.
  * @see {@link https://redis.io/commands/hmget}
  */
  HMGET(key: string, fields: string[]): RedisXTransaction<AddToList<L, (string | null)[]>, C, D>;
  /**
  * Returns the values associated with the specified fields in the hash stored at key.
  *
  * For every field that does not exist in the hash, a nil value is returned.
  * Because non-existing keys are treated as empty hashes, running HMGET against a non-existing key will return a list of nil values.
  *
  * - Available since: 2.0.0.
  * - Time complexity: O(N) where N is the number of fields being requested.
  * @param key Key holding the hash.
  * @param fields Fields to get.
  * @returns Array of values associated with the given fields, in the same order as they are requested.
  * @see {@link https://redis.io/commands/hmget}
  */
  HMGET(key: string, ...fields: string[]): RedisXTransaction<AddToList<L, (string | null)[]>, C, D>;
  /**
  * Returns the number of fields contained in the hash stored at key.
  *
  * - Available since: 2.0.0.
  * - Time complexity: O(1).
  * @param key Key to get hash length.
  * @returns The number of fields in the hash, or 0 when the key does not exist.
  * @see {@link https://redis.io/commands/hlen}
  */
  HLEN(key: string): RedisXTransaction<AddToList<L, number>, C, D>;
  /**
  * Returns all field names in the hash stored at key.
  *
  * - Available since: 2.0.0.
  * - Time complexity: O(N) where N is the size of the hash.
  * @param key The key of the hash.
  * @returns A set of fields in the hash, or an empty set when the key does not exist.
  * @see {@link https://redis.io/commands/hkeys}
  */
  HKEYS(key: string): RedisXTransaction<AddToList<L, Set<string>>, C, D>;
  /**
  * Increments the number stored at field in the hash stored at key by increment.
  * If key does not exist, a new key holding a hash is created. If field does not
  * exist the value is set to 0 before the operation is performed.
  *
  * The range of values supported by HINCRBY is limited to 64 bit signed integers.
  *
  * - Available since: 2.0.0.
  * - Time complexity: O(1).
  * @param key Key of the hash.
  * @param field Field in the hash to increment.
  * @param increment The increment value (can be negative for decrementing).
  * @returns The value of the field after the increment operation.
  * @see {@link https://redis.io/commands/hincrby}
  */
  HINCRBY(key: string, field: string | number, increment: number): RedisXTransaction<AddToList<L, number>, C, D>;
  /**
  * Removes the specified fields from the hash stored at key. Specified fields that do not exist within this hash are ignored.
  * Deletes the hash if no fields remain. If key does not exist, it is treated as an empty hash and this command returns 0.
  *
  * - Available since: 2.0.0. Multiple field arguments support added in 2.4.0.
  * - Time complexity: O(N) where N is the number of fields to be removed.
  * @param key Key of the hash.
  * @param fields Field to remove from the hash.
  * @returns The number of fields that were removed from the hash, excluding specified but non-existing fields.
  * @see {@link https://redis.io/commands/hdel}
  */
  HDEL(key: string, fields: (string | number)[]): RedisXTransaction<AddToList<L, number>, C, D>;
  /**
  * Removes the specified fields from the hash stored at key. Specified fields that do not exist within this hash are ignored.
  * Deletes the hash if no fields remain. If key does not exist, it is treated as an empty hash and this command returns 0.
  *
  * - Available since: 2.0.0. Multiple field arguments support added in 2.4.0.
  * - Time complexity: O(N) where N is the number of fields to be removed.
  * @param key Key of the hash.
  * @param fields Fields to remove from the hash.
  * @returns The number of fields that were removed from the hash, excluding specified but non-existing fields.
  * @see {@link https://redis.io/commands/hdel}
  */
  HDEL(key: string, ...fields: (string | number)[]): RedisXTransaction<AddToList<L, number>, C, D>;
  /**
  * Returns the string length of the value associated with field in the hash stored at key.
  * If the key or the field do not exist, 0 is returned.
  *
  * - Available since: 3.2.0.
  * - Time complexity: O(1).
  * @param key The key of the hash.
  * @param field The field in the hash.
  * @returns The string length of the value associated with the field, or zero when the field isn't present in the hash or the key doesn't exist at all.
  * @see {@link https://redis.io/commands/hstrlen}
  */
  HSTRLEN(key: string, field: string): RedisXTransaction<AddToList<L, number>, C, D>;
  /**
  * Returns if field is an existing field in the hash stored at key.
  *
  * - Available since: 2.0.0.
  * - Time complexity: O(1).
  * @param key Key of the hash.
  * @param field Field to check in the hash.
  * @returns Returns `true` if the hash contains the field. Returns `false` if the hash does not contain the field, or the key does not exist.
  * @see {@link https://redis.io/commands/hexists}
  */
  HEXISTS(key: string, field: string | number): RedisXTransaction<AddToList<L, boolean>, C, D>;
  /**
  * Sets field in the hash stored at key to value, only if field does not yet exist.
  * If key does not exist, a new key holding a hash is created.
  * If field already exists, this operation has no effect.
  *
  * - Available since: 2.0.0.
  * - Time complexity: O(1).
  * @param key The key of the hash.
  * @param field The field to set.
  * @param value The value to set.
  * @returns Returns `true` if the field is new and the value was set. Returns `false` if the field already exists and no operation was performed.
  * @see {@link https://redis.io/commands/hsetnx}
  */
  HSETNX(key: string, field: string, value: string | number): RedisXTransaction<AddToList<L, boolean>, C, D>;
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
  * Remove the specified members from the set stored at key.
  * Specified members that are not a member of this set are ignored.
  * If key does not exist, it is treated as an empty set and this command returns 0.
  *
  * - Available since: 1.0.0. Multiple members support added in 2.4.0.
  * - Time complexity: O(N) where N is the number of members to be removed.
  * @param key Key of the set.
  * @param member Member to remove from the set.
  * @returns The number of members that were removed from the set, not including non existing members.
  * @see {@link https://redis.io/commands/srem}
  */
  SREM(key: string, member: (string | number)[]): Promise<number>;
  /**
  * Remove the specified members from the set stored at key.
  * Specified members that are not a member of this set are ignored.
  * If key does not exist, it is treated as an empty set and this command returns 0.
  *
  * - Available since: 1.0.0. Multiple members support added in 2.4.0.
  * - Time complexity: O(N) where N is the number of members to be removed.
  * @param key Key of the set.
  * @param members Members to remove from the set.
  * @returns The number of members that were removed from the set, not including non existing members.
  * @see {@link https://redis.io/commands/srem}
  */
  SREM(key: string, ...members: (string | number)[]): Promise<number>;
  /**
  * Returns whether each member is a member of the set stored at key.
  *
  * For every member, `true` is returned if the value is a member of the set,
  * or `false` if the element is not a member of the set or if key does not exist.
  *
  * - Available since: 6.2.0.
  * - Time complexity: O(N) where N is the number of elements being checked for membership.
  * @param key The key of the set.
  * @param members The members to check.
  * @returns An array of booleans, representing the membership of the given elements in the same order as they are requested.
  * @see {@link https://redis.io/commands/smismember}
  */
  SMISMEMBER(key: string, ...members: string[]): Promise<boolean[]>;
  /**
  * Returns all the members of the set value stored at key.
  *
  * - Available since: 1.0.0.
  * - Time complexity: O(N) where N is the set cardinality.
  * @param key The key of the set.
  * @returns A set with all the members of the set.
  * @see {@link https://redis.io/commands/smembers}
  */
  SMEMBERS(key: string): Promise<Set<string>>;
  /**
  * Returns if member is a member of the set stored at key.
  *
  * - Available since: 1.0.0.
  * - Time complexity: O(1).
  * @param key The key of the set.
  * @param member The member to check.
  * @returns `true` if the member is a member of the set stored at key, `false` otherwise.
  * @see {@link https://redis.io/commands/sismember}
  */
  SISMEMBER(key: string, member: string): Promise<boolean>;
  /**
  * Returns the set cardinality (number of elements) of the set stored at key.
  *
  * - Available since: 1.0.0.
  * - Time complexity: O(1).
  * @param key The key of the set.
  * @returns The cardinality (number of elements) of the set, or `0` if the key does not exist.
  * @see {@link https://redis.io/commands/scard}
  */
  SCARD(key: string): Promise<number>;
  /**
  * Add the specified members to the set stored at key.
  * Specified members that are already a member of this set are ignored.
  * If key does not exist, a new set is created before adding the specified members.
  *
  * An error is returned when the value stored at key is not a set.
  *
  * - Available since: 1.0.0. Multiple members support added in 2.4.0.
  * - Time complexity: O(1) for each element added.
  * @param key Key of the set.
  * @param member Member to add to the set.
  * @returns The number of elements that were added to the set, not including all the elements already present in the set.
  * @see {@link https://redis.io/commands/sadd}
  */
  SADD(key: string, member: (string | number)[]): Promise<number>;
  /**
  * Add the specified members to the set stored at key.
  * Specified members that are already a member of this set are ignored.
  * If key does not exist, a new set is created before adding the specified members.
  *
  * An error is returned when the value stored at key is not a set.
  *
  * - Available since: 1.0.0. Multiple members support added in 2.4.0.
  * - Time complexity: O(1) for each element added.
  * @param key Key of the set.
  * @param members Members to add to the set.
  * @returns The number of elements that were added to the set, not including all the elements already present in the set.
  * @see {@link https://redis.io/commands/sadd}
  */
  SADD(key: string, ...members: (string | number)[]): Promise<number>;
  /**
  * Sets the given keys to their respective values. MSETNX will not perform
  * any operation at all even if just a single key already exists.
  *
  * - Available since: 1.0.1.
  * - Time complexity: O(N) where N is the number of keys to set.
  * @param pairs A record of key-value pairs.
  * @returns `true` if all the keys were set, `false` if no key was set (at least one key already existed).
  * @see {@link https://redis.io/commands/msetnx}
  */
  MSETNX(pairs: Record<string, string | number>): Promise<boolean>;
  /**
  * Set key to hold string value if key does not exist. In that case, it is equal to SET.
  * When key already holds a value, no operation is performed. SETNX is short for "SET if Not eXists".
  *
  * - Available since: 1.0.0.
  * - Time complexity: O(1).
  * @deprecated As of Redis version 2.6.12, this command is regarded as deprecated. It can be replaced by SET with the NX argument when migrating or writing new code.
  * @param key Key to set.
  * @param value Value to set.
  * @returns Integer reply: 1 if the key was set, 0 if the key was not set.
  * @see {@link https://redis.io/commands/setnx}
  */
  SETNX(key: string, value: string | number): Promise<boolean>;
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
  * Append a value to a key.
  *
  * If key already exists and is a string, this command appends the value at the end of the string.
  * If key does not exist it is created and set as an empty string, so APPEND will be similar to SET in this special case.
  * - Available since: 2.0.0.
  * - Time complexity: O(1). The amortized time complexity is O(1) assuming the appended value is small and the already present value is of any size, since the dynamic string library used by Redis will double the free space available on every reallocation.
  * @param key Key to append to.
  * @param value Value to append.
  * @returns The length of the string after the append operation.
  * @see {@link https://redis.io/commands/append}
  */
  APPEND(key: string, value: string): Promise<number>;
  /**
  * Increments the number stored at key by one. If the key does not exist,
  * it is set to 0 before performing the operation. An error is returned if the
  * key contains a value of the wrong type or contains a string that can not
  * be represented as integer. This operation is limited to 64 bit signed integers.
  * - Available since: 1.0.0.
  * - Time complexity: O(1).
  * @param key Key to increment.
  * @returns The value of the key after incrementing it.
  * @see {@link https://redis.io/commands/incr}
  */
  INCR(key: string): Promise<number>;
  /**
  * Increment the string representing a floating point number stored at key by the specified increment.
  * By using a negative increment value, the result is that the value stored at the key is decremented.
  * If the key does not exist, it is set to 0 before performing the operation.
  *
  * - Available since: 2.6.0.
  * - Time complexity: O(1).
  * @param key Key to increment.
  * @param increment Value to increment by.
  * @returns The value of key after the increment.
  * @see {@link https://redis.io/commands/incrbyfloat}
  */
  INCRBYFLOAT(key: string, increment: number): Promise<string>;
  /**
  * Returns the values of all specified keys. For every key that does not hold a
  * string value or does not exist, the special value `null` is returned.
  * Because of this, the operation never fails.
  *
  * - Available since: 1.0.0.
  * - Time complexity: O(N) where N is the number of keys to retrieve.
  * @param keys The keys to get.
  * @returns Array reply: a list of values at the specified keys.
  * @see {@link https://redis.io/commands/mget}
  */
  MGET<const K extends string[]>(keys: K): Promise<{ [I in keyof K]: string | null }>;
  /**
  * Returns the values of all specified keys. For every key that does not hold a
  * string value or does not exist, the special value `null` is returned.
  * Because of this, the operation never fails.
  *
  * - Available since: 1.0.0.
  * - Time complexity: O(N) where N is the number of keys to retrieve.
  * @param keys The keys to get.
  * @returns Array reply: a list of values at the specified keys.
  * @see {@link https://redis.io/commands/mget}
  */
  MGET<const K extends string[]>(...keys: K): Promise<{ [I in keyof K]: string | null }>;
  /**
  * Get the value of key and delete the key. This command is similar to GET, except for the fact
  * that it also deletes the key on success (if and only if the key's value type is a string).
  *
  * - Available since: 6.2.0.
  * - Time complexity: O(1).
  * @param key Key to get and delete.
  * @returns The value of key, or `null` when key does not exist or its value is not a string.
  * @see {@link https://redis.io/commands/getdel}
  */
  GETDEL(key: string): Promise<string | null>;
  /**
  * Sets the given keys to their respective values. MSET replaces existing values with new values, just as regular SET.
  * MSET is atomic, so all given keys are set at once. It is not possible for clients to see that some of the keys were updated while others are unchanged.
  * - Available since: 1.0.1.
  * - Time complexity: O(N) where N is the number of keys to set.
  * @param pairs A record of key-value pairs.
  * @returns "OK"
  * @see {@link https://redis.io/commands/mset}
  */
  MSET(pairs: Record<string, string | number>): Promise<"OK">;
  /**
  * Increments the number stored at key by increment. If the key does not exist, it is set to 0 before performing the operation.
  * An error is returned if the key contains a value of the wrong type or contains a string that cannot be represented as integer.
  * This operation is limited to 64 bit signed integers.
  *
  * - Available since: 1.0.0.
  * - Time complexity: O(1).
  * @param key Key to increment.
  * @param increment Amount to increment by.
  * @returns The value of the key after the increment.
  * @see {@link https://redis.io/commands/incrby}
  */
  INCRBY(key: string, increment: number): Promise<number>;
  /**
  * Overwrites part of the string stored at key, starting at the specified offset, for the entire length of value.
  * If the offset is larger than the current length of the string at key, the string is padded with zero-bytes to make offset fit.
  * Non-existing keys are considered as empty strings, so this command will make sure it holds a string large enough to be able to set value at offset.
  *
  * Note that the maximum offset that you can set is `2^29-1` (536870911), as Redis Strings are limited to 512 megabytes.
  *
  * - Available since: 2.2.0.
  * - Time complexity: O(1), not counting the time taken to copy the new string in place. Usually, this string is very small so the amortized complexity is O(1). Otherwise, complexity is O(M) with M being the length of the value argument.
  * @param key Key to modify.
  * @param offset Position at which the overwrite should begin.
  * @param value String that will be written to the key, starting at the specified offset.
  * @returns The length of the string after it was modified by the command.
  * @see {@link https://redis.io/commands/setrange}
  */
  SETRANGE(key: string, offset: number, value: string): Promise<number>;
  /**
  * Returns the substring of the string value stored at key, determined by the offsets start and end (both are inclusive).
  * Negative offsets can be used in order to provide an offset starting from the end of the string.
  * So -1 means the last character, -2 the penultimate and so forth.
  * - Available since: 1.0.0.
  * - Time complexity: O(N) where N is the length of the returned string. The complexity is ultimately determined by the returned length, but because creating a substring from an existing string is very cheap, it can be considered O(1) for small strings.
  * @deprecated As of Redis version 2.0.0, this command is regarded as deprecated. It can be replaced by GETRANGE when migrating or writing new code.
  * @param key Key to get the substring from.
  * @param start Start offset (inclusive).
  * @param end End offset (inclusive).
  * @returns The substring of the string value stored at key.
  * @see {@link https://redis.io/commands/substr}
  */
  SUBSTR(key: string, start: number, end: number): Promise<string>;
  /**
  * Atomically sets key to value and returns the old value stored at key.
  * Returns an error when key exists but does not hold a string value.
  * Any previous time to live associated with the key is discarded on successful SET operation.
  *
  * - Available since: 1.0.0.
  * - Time complexity: O(1).
  * @deprecated As of Redis version 6.2.0, this command is regarded as deprecated. It can be replaced by SET with the GET argument when migrating or writing new code.
  * @param key Key to set.
  * @param value Value to set.
  * @returns The old value stored at key, or `null` if key did not exist.
  * @see {@link https://redis.io/commands/getset}
  */
  GETSET(key: string, value: string | number): Promise<string | null>;
  /**
  * Reduces the value stored at the specified key by the specified decrement.
  * If the key does not exist, it is initialized with a value of 0 before performing the operation.
  * If the key's value is not of the correct type or cannot be represented as an integer, an error is returned.
  * This operation is limited to 64-bit signed integers.
  *
  * - Available since: 1.0.0.
  * - Time complexity: O(1).
  * @param key Key to decrement.
  * @param decrement The value to decrement by.
  * @returns The value of the key after decrementing it.
  * @see {@link https://redis.io/commands/decrby}
  */
  DECRBY(key: string, decrement: number): Promise<number>;
  /**
  * Returns the substring of the string value stored at key, determined by the offsets start and end (both are inclusive).
  * Negative offsets can be used in order to provide an offset starting from the end of the string.
  * So -1 means the last character, -2 the penultimate and so forth.
  *
  * The function handles out of range requests by limiting the resulting range to the actual length of the string.
  * - Available since: 2.4.0.
  * - Time complexity: O(N) where N is the length of the returned string. The complexity is ultimately determined by the returned length, but because creating a substring from an existing string is very cheap, it can be considered O(1) for small strings.
  * @param key The key holding the string value.
  * @param start The starting offset. Can be negative to count from the end of the string.
  * @param end The ending offset (inclusive). Can be negative to count from the end of the string.
  * @returns The substring.
  * @see {@link https://redis.io/commands/getrange}
  */
  GETRANGE(key: string, start: number, end: number): Promise<string>;
  /**
  * Set key to hold the string value and set key to timeout after a given number of seconds.
  * This command is equivalent to SET key value EX seconds.
  *
  * - Available since: 2.0.0.
  * - Time complexity: O(1).
  * @deprecated As of Redis version 2.6.12, this command is regarded as deprecated. It can be replaced by SET with the EX argument when migrating or writing new code.
  * @param key Key to set.
  * @param seconds Timeout in seconds.
  * @param value Value to set.
  * @returns Simple string reply: OK.
  * @see {@link https://redis.io/commands/setex}
  */
  SETEX(key: string, seconds: number, value: string | number): Promise<"OK">;
  /**
  * Get the value of key and optionally set its expiration.
  * GETEX is similar to GET, but is a write command with additional options.
  *
  * An error is returned if the value stored at key is not a string, because GETEX only handles string values.
  * - Available since: 6.2.0.
  * - Time complexity: O(1).
  * @param key Key to get.
  * @param options Command options.
  * @returns The value of key, or `null` when key does not exist.
  * @see {@link https://redis.io/commands/getex}
  */
  GETEX(key: string, options?: GetexOptions): Promise<string | null>;
  /**
  * Returns the length of the string value stored at key.
  * An error is returned when key holds a non-string value.
  *
  * - Available since: 2.2.0.
  * - Time complexity: O(1).
  * @param key Key to get length of.
  * @returns The length of the string stored at key, or 0 when the key does not exist.
  * @see {@link https://redis.io/commands/strlen}
  */
  STRLEN(key: string): Promise<number>;
  /**
  * Decrements the number stored at key by one. If the key does not exist,
  * it is set to 0 before performing the operation. An error is returned if the
  * key contains a value of the wrong type or contains a string that can not
  * be represented as integer. This operation is limited to 64 bit signed integers.
  * - Available since: 1.0.0.
  * - Time complexity: O(1).
  * @param key Key to decrement.
  * @returns The value of the key after decrementing it.
  * @see {@link https://redis.io/commands/decr}
  */
  DECR(key: string): Promise<number>;
  /**
  * Set key to hold the string value and set key to timeout after a given number of milliseconds.
  * This command is similar to SETEX, except that the expiration time is specified in milliseconds instead of seconds.
  *
  * - Available since: 2.6.0.
  * - Time complexity: O(1).
  * @deprecated As of Redis version 2.6.12, this command is regarded as deprecated. It can be replaced by SET with the PX argument when migrating or writing new code.
  * @param key Key to set.
  * @param milliseconds Expiration time in milliseconds.
  * @param value Value to set.
  * @returns "OK" if the command was executed successfully.
  * @see {@link https://redis.io/commands/psetex}
  */
  PSETEX(key: string, milliseconds: number, value: string | number): Promise<"OK">;
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
  * Insert all the specified values at the tail of the list stored at key.
  *
  * If key does not exist, it is created as empty list before performing the push operation.
  * When key holds a value that is not a list, an error is returned.
  * - Available since: 1.0.0.
  * - Multiple elements are available since Redis 2.4.0.
  * - Time complexity: O(1) for each element added, so O(N) to add N elements when the command is called with multiple arguments.
  * @param key Key to push values to.
  * @param elements An array of elements to add to the list.
  * @returns The length of the list after the push operation.
  * @see {@link https://redis.io/commands/rpush}
  */
  RPUSH(key: string, elements: (string | number)[]): Promise<number>;
  /**
  * Insert all the specified values at the tail of the list stored at key.
  *
  * If key does not exist, it is created as empty list before performing the push operation.
  * When key holds a value that is not a list, an error is returned.
  * - Available since: 1.0.0.
  * - Multiple elements are available since Redis 2.4.0.
  * - Time complexity: O(1) for each element added, so O(N) to add N elements when the command is called with multiple arguments.
  * @param key Key to push values to.
  * @param elements Elements to add to the list.
  * @returns The length of the list after the push operation.
  * @see {@link https://redis.io/commands/rpush}
  */
  RPUSH(key: string, ...elements: (string | number)[]): Promise<number>;
  /**
  * Removes and returns the first elements of the list stored at key.
  *
  * By default, the command pops a single element from the beginning of the list. When provided
  * with the optional count argument, the reply will consist of up to count elements, depending
  * on the list's length.
  *
  * - Available since: 1.0.0.
  * - Time complexity: O(N) where N is the number of elements returned.
  * @param key The key of the list.
  * @returns The value of the first element, or `null` when key does not exist.
  * @see {@link https://redis.io/commands/lpop}
  */
  LPOP(key: string): Promise<string | null>;
  /**
  * Removes and returns the first elements of the list stored at key.
  *
  * By default, the command pops a single element from the beginning of the list. When provided
  * with the optional count argument, the reply will consist of up to count elements, depending
  * on the list's length.
  *
  * - Available since: 6.2.0 (for the count argument).
  * - Time complexity: O(N) where N is the number of elements returned.
  * @param key The key of the list.
  * @param count The number of elements to pop.
  * @returns An array of popped elements, or `null` when key does not exist.
  * @see {@link https://redis.io/commands/lpop}
  */
  LPOP(key: string, count: number): Promise<string[] | null>;
  /**
  * Atomically returns and removes the last element (tail) of the list stored at source,
  * and pushes the element at the first element (head) of the list stored at destination.
  *
  * For example: consider source holding the list a,b,c, and destination holding the list x,y,z.
  * Executing RPOPLPUSH results in source holding a,b and destination holding c,x,y,z.
  *
  * If source does not exist, the value nil is returned and no operation is performed.
  * If source and destination are the same, the operation is equivalent to removing the
  * last element from the list and pushing it as first element of the list, so it can be
  * considered as a list rotation command.
  *
  * - Available since: 1.2.0.
  * - Time complexity: O(1).
  * @deprecated As of Redis version 6.2.0, this command is regarded as deprecated. It can be replaced by LMOVE with the RIGHT and LEFT arguments when migrating or writing new code.
  * @param source Source list key.
  * @param destination Destination list key.
  * @returns The element being popped and pushed, or `null` if the source list is empty.
  * @see {@link https://redis.io/commands/rpoplpush}
  */
  RPOPLPUSH(source: string, destination: string): Promise<string | null>;
  /**
  * Insert all the specified values at the tail of the list stored at key, only if key already exists and holds a list.
  * In contrary to RPUSH, no operation will be performed when key does not yet exist.
  *
  * - Available since: 2.2.0.
  * - Multiple elements are available since Redis 4.0.0.
  * - Time complexity: O(1) for each element added, so O(N) to add N elements when the command is called with multiple arguments.
  * @param key Key to push values to.
  * @param elements An array of elements to add to the list.
  * @returns The length of the list after the push operation.
  * @see {@link https://redis.io/commands/rpushx}
  */
  RPUSHX(key: string, elements: (string | number)[]): Promise<number>;
  /**
  * Insert all the specified values at the tail of the list stored at key, only if key already exists and holds a list.
  * In contrary to RPUSH, no operation will be performed when key does not yet exist.
  *
  * - Available since: 2.2.0.
  * - Multiple elements are available since Redis 4.0.0.
  * - Time complexity: O(1) for each element added, so O(N) to add N elements when the command is called with multiple arguments.
  * @param key Key to push values to.
  * @param elements Elements to add to the list.
  * @returns The length of the list after the push operation.
  * @see {@link https://redis.io/commands/rpushx}
  */
  RPUSHX(key: string, ...elements: (string | number)[]): Promise<number>;
  /**
  * Sets the list element at index to element. For more information on the index argument, see LINDEX.
  *
  * An error is returned for out of range indexes.
  *
  * - Available since: 1.0.0.
  * - Time complexity: O(N) where N is the length of the list. Setting either the first or the last element of the list is O(1).
  * @param key The key of the list.
  * @param index The index of the element to set. Can be negative to count from the end of the list.
  * @param element The new value to set.
  * @returns "OK" if successful.
  * @see {@link https://redis.io/commands/lset}
  */
  LSET(key: string, index: number, element: string | number): Promise<"OK">;
  /**
  * Removes the first count occurrences of elements equal to element from the list stored at key.
  * The count argument influences the operation in the following ways:
  * - count > 0: Remove elements equal to element moving from head to tail.
  * - count < 0: Remove elements equal to element moving from tail to head.
  * - count = 0: Remove all elements equal to element.
  *
  * - Available since: 1.0.0.
  * - Time complexity: O(N+M) where N is the length of the list and M is the number of elements removed.
  * @param key The key of the list.
  * @param count The number of occurrences to remove. Use negative values to start from the tail.
  * @param element The element to remove from the list.
  * @returns The number of removed elements.
  * @see {@link https://redis.io/commands/lrem}
  */
  LREM(key: string, count: number, element: string | number): Promise<number>;
  /**
  * Insert all the specified elements at the head of the list stored at key.
  *
  * If key does not exist, it is created as empty list before performing the push operations.
  * - Available since: 1.0.0.
  * - Multiple field/value pairs are available since Redis 2.4.0.
  * - Time complexity: O(1) for each element added.
  * @param key Key of the list.
  * @param elements An array of elements to add to the list.
  * @returns The length of the list after the push operation.
  * @see {@link https://redis.io/commands/lpush}
  */
  LPUSH(key: string, elements: (string | number)[]): Promise<number>;
  /**
  * Insert all the specified elements at the head of the list stored at key.
  *
  * If key does not exist, it is created as empty list before performing the push operations.
  * - Available since: 1.0.0.
  * - Multiple field/value pairs are available since Redis 2.4.0.
  * - Time complexity: O(1) for each element added.
  * @param key Key of the list.
  * @param elements Elements to add to the list.
  * @returns The length of the list after the push operation.
  * @see {@link https://redis.io/commands/lpush}
  */
  LPUSH(key: string, ...elements: (string | number)[]): Promise<number>;
  /**
  * Inserts specified values at the head of the list stored at key, only if key already exists and holds a list.
  * In contrary to LPUSH, no operation will be performed when key does not yet exist.
  *
  * - Available since: 2.2.0.
  * - Time complexity: O(1) for each element added, so O(N) to add N elements when the command is called with multiple arguments.
  * @param key Key of the list.
  * @param elements Element or array of elements to push to the list.
  * @returns The length of the list after the push operation.
  * @see {@link https://redis.io/commands/lpushx}
  */
  LPUSHX(key: string, elements: (string | number)[]): Promise<number>;
  /**
  * Inserts specified values at the head of the list stored at key, only if key already exists and holds a list.
  * In contrary to LPUSH, no operation will be performed when key does not yet exist.
  *
  * - Available since: 2.2.0.
  * - Time complexity: O(1) for each element added, so O(N) to add N elements when the command is called with multiple arguments.
  * @param key Key of the list.
  * @param elements One or more elements to push to the list.
  * @returns The length of the list after the push operation.
  * @see {@link https://redis.io/commands/lpushx}
  */
  LPUSHX(key: string, ...elements: (string | number)[]): Promise<number>;
  /**
  * Removes and returns the last elements of the list stored at key.
  *
  * By default, the command pops a single element from the end of the list.
  * When provided with the optional count argument, the reply will consist
  * of up to count elements, depending on the list's length.
  *
  * - Available since: 1.0.0.
  * - Time complexity: O(N) where N is the number of elements returned.
  * @param key The key of the list.
  * @returns The value of the last element, or `null` when key does not exist.
  * @see {@link https://redis.io/commands/rpop}
  */
  RPOP(key: string): Promise<string | null>;
  /**
  * Removes and returns the last elements of the list stored at key.
  *
  * By default, the command pops a single element from the end of the list.
  * When provided with the optional count argument, the reply will consist
  * of up to count elements, depending on the list's length.
  *
  * - Available since: 6.2.0 (for the count argument).
  * - Time complexity: O(N) where N is the number of elements returned.
  * @param key The key of the list.
  * @param count The number of elements to pop.
  * @returns Array of popped elements, or `null` when key does not exist.
  * @see {@link https://redis.io/commands/rpop}
  */
  RPOP(key: string, count: number): Promise<string[] | null>;
  /**
  * Returns the specified elements of the list stored at key. The offsets start and stop
  * are zero-based indexes, with 0 being the first element of the list (the head of the list),
  * 1 being the next element and so on.
  *
  * These offsets can also be negative numbers indicating offsets starting at the end of the list.
  * For example, -1 is the last element of the list, -2 the penultimate, and so on.
  *
  * Out of range indexes will not produce an error. If start is larger than the end of the list,
  * an empty list is returned. If stop is larger than the actual end of the list, Redis will
  * treat it like the last element of the list.
  *
  * - Available since: 1.0.0.
  * - Time complexity: O(S+N) where S is the distance of start offset from HEAD for small lists,
  *   from nearest end (HEAD or TAIL) for large lists; and N is the number of elements in the specified range.
  * @param key The key of the list.
  * @param start The starting position (inclusive, 0-based index).
  * @param stop The ending position (inclusive, 0-based index).
  * @returns Array of elements in the specified range, or an empty array if the key doesn't exist.
  * @see {@link https://redis.io/commands/lrange}
  */
  LRANGE(key: string, start: number, stop: number): Promise<string[]>;
  /**
  * Returns the length of the list stored at key. If key does not exist, it is interpreted as an empty list and 0 is returned.
  * An error is returned when the value stored at key is not a list.
  *
  * - Available since: 1.0.0.
  * - Time complexity: O(1).
  * @param key Key to get the length of the list for.
  * @returns The length of the list at key.
  * @see {@link https://redis.io/commands/llen}
  */
  LLEN(key: string): Promise<number>;
  /**
  * Inserts element in the list stored at key either before or after the reference value.
  *
  * - Available since: 2.2.0.
  * - Time complexity: O(N) where N is the number of elements to traverse before seeing the value pivot.
  *   This means that inserting somewhere on the left end on the list (head) can be considered O(1)
  *   and inserting somewhere on the right end (tail) is O(N).
  * @param key Key of the list.
  * @param element Element to insert.
  * @param options Command options.
  * @returns The length of the list after the insert operation, or 0 when the key doesn't exist, or -1 when the pivot wasn't found.
  * @see {@link https://redis.io/commands/linsert}
  */
  LINSERT(key: string, element: string | number, options: {
    BEFORE: string | number;
  } | {
    AFTER: string | number;
  }): Promise<number>;
  /**
  * Trim an existing list so that it will contain only the specified range of elements specified.
  * Both `start` and `stop` are zero-based indexes, where 0 is the first element of the list (the head),
  * 1 the next element and so on.
  *
  * `start` and `stop` can also be negative numbers indicating offsets from the end of the list,
  * where -1 is the last element of the list, -2 the penultimate element and so on.
  *
  * Out of range indexes will not produce an error: if `start` is larger than the end of the list,
  * or `start` > `stop`, the result will be an empty list (which causes key to be removed).
  * If `stop` is larger than the end of the list, Redis will treat it like the last element of the list.
  *
  * - Available since: 1.0.0.
  * - Time complexity: O(N) where N is the number of elements to be removed by the operation.
  * @param key The key of the list to trim.
  * @param start Zero-based index of the first element to keep.
  * @param stop Zero-based index of the last element to keep.
  * @returns "OK"
  * @see {@link https://redis.io/commands/ltrim}
  */
  LTRIM(key: string, start: number, stop: number): Promise<"OK">;
  /**
  * Returns the element at index in the list stored at key.
  * The index is zero-based, so 0 means the first element, 1 the second element and so on.
  * Negative indices can be used to designate elements starting at the tail of the list.
  *
  * - Available since: 1.0.0.
  * - Time complexity: O(N) where N is the number of elements to traverse to get to the element at index. This makes asking for the first or the last element of the list O(1).
  * @param key Key of the list.
  * @param index Zero-based index of the element to return.
  * @returns The requested element, or `null` when index is out of range.
  * @see {@link https://redis.io/commands/lindex}
  */
  LINDEX(key: string, index: number): Promise<string | null>;
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
  * Returns all values in the hash stored at key.
  * - Available since: 2.0.0.
  * - Time complexity: O(N) where N is the size of the hash.
  * @param key The key of the hash.
  * @returns A set of values in the hash, or an empty set when the key does not exist.
  * @see {@link https://redis.io/commands/hvals}
  */
  HVALS(key: string): Promise<Set<string>>;
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
  * Increment the specified field of a hash stored at key, and representing a floating point number, by the specified increment.
  * If the increment value is negative, the result is to have the hash field value decremented instead of incremented.
  * If the field does not exist, it is set to 0 before performing the operation.
  *
  * - Available since: 2.6.0.
  * - Time complexity: O(1).
  * @param key Key of the hash.
  * @param field Field in the hash to increment.
  * @param increment The increment value (can be negative for decrementing).
  * @returns The value of the field after the increment operation as a string representing the floating point value.
  * @see {@link https://redis.io/commands/hincrbyfloat}
  */
  HINCRBYFLOAT(key: string, field: string | number, increment: number): Promise<string>;
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
  * Sets the specified fields to their respective values in the hash stored at key.
  * This command overwrites any specified fields already existing in the hash.
  * If key does not exist, a new key holding a hash is created.
  *
  * - Available since: 2.0.0.
  * - Time complexity: O(N) where N is the number of fields being set.
  * @deprecated As of Redis version 4.0.0, this command is regarded as deprecated. It can be replaced by HSET with multiple field-value pairs when migrating or writing new code.
  * @param key Key that contains the hash.
  * @param field Field to set.
  * @param value Value to set.
  * @returns Simple string reply: "OK".
  * @see {@link https://redis.io/commands/hmset}
  */
  HMSET(key: string, field: string, value: string | number): Promise<"OK">;
  /**
  * Sets the specified fields to their respective values in the hash stored at key.
  * This command overwrites any specified fields already existing in the hash.
  * If key does not exist, a new key holding a hash is created.
  *
  * - Available since: 2.0.0.
  * - Time complexity: O(N) where N is the number of fields being set.
  * @deprecated As of Redis version 4.0.0, this command is regarded as deprecated. It can be replaced by HSET with multiple field-value pairs when migrating or writing new code.
  * @param key Key that contains the hash.
  * @param pairs Object containing field/value pairs to set.
  * @returns Simple string reply: "OK".
  * @see {@link https://redis.io/commands/hmset}
  */
  HMSET(key: string, pairs: Record<string, string | number>): Promise<"OK">;
  /**
  * Returns the values associated with the specified fields in the hash stored at key.
  *
  * For every field that does not exist in the hash, a nil value is returned.
  * Because non-existing keys are treated as empty hashes, running HMGET against a non-existing key will return a list of nil values.
  *
  * - Available since: 2.0.0.
  * - Time complexity: O(N) where N is the number of fields being requested.
  * @param key Key holding the hash.
  * @param fields Fields to get.
  * @returns Array of values associated with the given fields, in the same order as they are requested.
  * @see {@link https://redis.io/commands/hmget}
  */
  HMGET(key: string, fields: string[]): Promise<(string | null)[]>;
  /**
  * Returns the values associated with the specified fields in the hash stored at key.
  *
  * For every field that does not exist in the hash, a nil value is returned.
  * Because non-existing keys are treated as empty hashes, running HMGET against a non-existing key will return a list of nil values.
  *
  * - Available since: 2.0.0.
  * - Time complexity: O(N) where N is the number of fields being requested.
  * @param key Key holding the hash.
  * @param fields Fields to get.
  * @returns Array of values associated with the given fields, in the same order as they are requested.
  * @see {@link https://redis.io/commands/hmget}
  */
  HMGET(key: string, ...fields: string[]): Promise<(string | null)[]>;
  /**
  * Returns the number of fields contained in the hash stored at key.
  *
  * - Available since: 2.0.0.
  * - Time complexity: O(1).
  * @param key Key to get hash length.
  * @returns The number of fields in the hash, or 0 when the key does not exist.
  * @see {@link https://redis.io/commands/hlen}
  */
  HLEN(key: string): Promise<number>;
  /**
  * Returns all field names in the hash stored at key.
  *
  * - Available since: 2.0.0.
  * - Time complexity: O(N) where N is the size of the hash.
  * @param key The key of the hash.
  * @returns A set of fields in the hash, or an empty set when the key does not exist.
  * @see {@link https://redis.io/commands/hkeys}
  */
  HKEYS(key: string): Promise<Set<string>>;
  /**
  * Increments the number stored at field in the hash stored at key by increment.
  * If key does not exist, a new key holding a hash is created. If field does not
  * exist the value is set to 0 before the operation is performed.
  *
  * The range of values supported by HINCRBY is limited to 64 bit signed integers.
  *
  * - Available since: 2.0.0.
  * - Time complexity: O(1).
  * @param key Key of the hash.
  * @param field Field in the hash to increment.
  * @param increment The increment value (can be negative for decrementing).
  * @returns The value of the field after the increment operation.
  * @see {@link https://redis.io/commands/hincrby}
  */
  HINCRBY(key: string, field: string | number, increment: number): Promise<number>;
  /**
  * Removes the specified fields from the hash stored at key. Specified fields that do not exist within this hash are ignored.
  * Deletes the hash if no fields remain. If key does not exist, it is treated as an empty hash and this command returns 0.
  *
  * - Available since: 2.0.0. Multiple field arguments support added in 2.4.0.
  * - Time complexity: O(N) where N is the number of fields to be removed.
  * @param key Key of the hash.
  * @param fields Field to remove from the hash.
  * @returns The number of fields that were removed from the hash, excluding specified but non-existing fields.
  * @see {@link https://redis.io/commands/hdel}
  */
  HDEL(key: string, fields: (string | number)[]): Promise<number>;
  /**
  * Removes the specified fields from the hash stored at key. Specified fields that do not exist within this hash are ignored.
  * Deletes the hash if no fields remain. If key does not exist, it is treated as an empty hash and this command returns 0.
  *
  * - Available since: 2.0.0. Multiple field arguments support added in 2.4.0.
  * - Time complexity: O(N) where N is the number of fields to be removed.
  * @param key Key of the hash.
  * @param fields Fields to remove from the hash.
  * @returns The number of fields that were removed from the hash, excluding specified but non-existing fields.
  * @see {@link https://redis.io/commands/hdel}
  */
  HDEL(key: string, ...fields: (string | number)[]): Promise<number>;
  /**
  * Returns the string length of the value associated with field in the hash stored at key.
  * If the key or the field do not exist, 0 is returned.
  *
  * - Available since: 3.2.0.
  * - Time complexity: O(1).
  * @param key The key of the hash.
  * @param field The field in the hash.
  * @returns The string length of the value associated with the field, or zero when the field isn't present in the hash or the key doesn't exist at all.
  * @see {@link https://redis.io/commands/hstrlen}
  */
  HSTRLEN(key: string, field: string): Promise<number>;
  /**
  * Returns if field is an existing field in the hash stored at key.
  *
  * - Available since: 2.0.0.
  * - Time complexity: O(1).
  * @param key Key of the hash.
  * @param field Field to check in the hash.
  * @returns Returns `true` if the hash contains the field. Returns `false` if the hash does not contain the field, or the key does not exist.
  * @see {@link https://redis.io/commands/hexists}
  */
  HEXISTS(key: string, field: string | number): Promise<boolean>;
  /**
  * Sets field in the hash stored at key to value, only if field does not yet exist.
  * If key does not exist, a new key holding a hash is created.
  * If field already exists, this operation has no effect.
  *
  * - Available since: 2.0.0.
  * - Time complexity: O(1).
  * @param key The key of the hash.
  * @param field The field to set.
  * @param value The value to set.
  * @returns Returns `true` if the field is new and the value was set. Returns `false` if the field already exists and no operation was performed.
  * @see {@link https://redis.io/commands/hsetnx}
  */
  HSETNX(key: string, field: string, value: string | number): Promise<boolean>;
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
} //#endregion
export { RedisXClient, RedisXTransaction };