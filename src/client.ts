/* eslint-disable max-lines */

import { RedisXTransaction } from './transaction.js';
import type {
	Command,
	RedisClient,
} from './types.js';

export class RedisXClient {
	// eslint-disable-next-line no-useless-constructor, no-empty-function
	constructor(private redisClient: RedisClient) {}

	async sendCommand<T extends string>(
		command: T,
		...args: (string | number)[]
	): Promise<unknown> {
		return await this.redisClient.sendCommand([
			command,
			...args.map(String),
		]);
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private async useCommand(command: Command): Promise<any> {
		const result = await this.redisClient.sendCommand(command.args);

		if (command.replyTransform) {
			return command.replyTransform(result);
		}

		return result;
	}

	createTransaction(): RedisXTransaction<[], false, unknown> {
		return new RedisXTransaction(this.redisClient);
	}

	// MARK: commands
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
	MSETNX(pairs: Record<string, string | number>): Promise<boolean> {
		return this.useCommand(input_msetnx(pairs));
	}

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
	SETNX(key: string, value: string | number): Promise<boolean> {
		return this.useCommand(input_setnx(key, value));
	}

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
	GET(key: string): Promise<string | null> {
		return this.useCommand(input_get(key));
	}

	/**
	 * Set the string value of a key.
	 * - Available since: 1.0.0.
	 * - Time complexity: O(1).
	 * @param key Key to set.
	 * @param value Value to set.
	 * @returns Returns string `"OK"` if the key was set, or `null` if operation was aborted (conflict with one of the XX/NX options).
	 * @see {@link https://redis.io/commands/set}
	 */
	SET(key: string, value: string | number): Promise<'OK' | null>;
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
	SET(key: string, value: string | number, options: SetOptions): Promise<'OK' | null>;
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

	SET(key: string, value: string | number, options?: SetOptions & Partial<SetOptionsGet>) {
		return this.useCommand(input_set(key, value, options));
	}

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
	APPEND(key: string, value: string): Promise<number> {
		return this.useCommand(input_append(key, value));
	}

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
	INCR(key: string): Promise<number> {
		return this.useCommand(input_incr(key));
	}

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
	INCRBYFLOAT(key: string, increment: number): Promise<string> {
		return this.useCommand(input_incrbyfloat(key, increment));
	}

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

	MGET(...args: (string | string[])[]): Promise<(string | null)[]> {
		return this.useCommand(input_mget(...args));
	}

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
	GETDEL(key: string): Promise<string | null> {
		return this.useCommand(input_getdel(key));
	}

	/**
	 * Sets the given keys to their respective values. MSET replaces existing values with new values, just as regular SET.
	 * MSET is atomic, so all given keys are set at once. It is not possible for clients to see that some of the keys were updated while others are unchanged.
	 * - Available since: 1.0.1.
	 * - Time complexity: O(N) where N is the number of keys to set.
	 * @param pairs A record of key-value pairs.
	 * @returns "OK"
	 * @see {@link https://redis.io/commands/mset}
	 */
	MSET(pairs: Record<string, string | number>): Promise<'OK'> {
		return this.useCommand(input_mset(pairs));
	}

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
	INCRBY(key: string, increment: number): Promise<number> {
		return this.useCommand(input_incrby(key, increment));
	}

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
	SETRANGE(key: string, offset: number, value: string): Promise<number> {
		return this.useCommand(input_setrange(key, offset, value));
	}

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
	SUBSTR(key: string, start: number, end: number): Promise<string> {
		return this.useCommand(input_substr(key, start, end));
	}

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
	GETSET(key: string, value: string | number): Promise<string | null> {
		return this.useCommand(input_getset(key, value));
	}

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
	DECRBY(key: string, decrement: number): Promise<number> {
		return this.useCommand(input_decrby(key, decrement));
	}

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
	GETRANGE(key: string, start: number, end: number): Promise<string> {
		return this.useCommand(input_getrange(key, start, end));
	}

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
	SETEX(key: string, seconds: number, value: string | number): Promise<'OK'> {
		return this.useCommand(input_setex(key, seconds, value));
	}

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
	GETEX(key: string, options?: GetexOptions): Promise<string | null> {
		return this.useCommand(input_getex(key, options));
	}

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
	STRLEN(key: string): Promise<number> {
		return this.useCommand(input_strlen(key));
	}

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
	DECR(key: string): Promise<number> {
		return this.useCommand(input_decr(key));
	}

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
	PSETEX(key: string, milliseconds: number, value: string | number): Promise<'OK'> {
		return this.useCommand(input_psetex(key, milliseconds, value));
	}

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
	PEXPIRE(key: string, seconds: number, options?: PexpireOptions): Promise<boolean> {
		return this.useCommand(input_pexpire(key, seconds, options));
	}

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
	PTTL(key: string): Promise<number> {
		return this.useCommand(input_pttl(key));
	}

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
	TTL(key: string): Promise<number> {
		return this.useCommand(input_ttl(key));
	}

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
	EXPIRE(key: string, seconds: number, options?: ExpireOptions): Promise<boolean> {
		return this.useCommand(input_expire(key, seconds, options));
	}

	/**
	 * Returns the string representation of the type of the value stored at `key`.
	 * - Available since: 1.0.0.
	 * - Time complexity: O(1).
	 * @param key The key to check.
	 * @returns "OK".
	 * @see {@link https://redis.io/commands/rename}
	 */
	TYPE(key: string): Promise<'string' | 'list' | 'set' | 'zset' | 'hash' | 'stream' | 'vectorset'> {
		return this.useCommand(input_type(key));
	}

	/**
	 * Returns all keys matching pattern.
	 * - Available since: 1.0.0.
	 * - Time complexity: O(N) with N being the number of keys in the database.
	 * @param pattern Pattern to match.
	 * @returns A set of keys matching pattern.
	 * @see {@link https://redis.io/commands/keys}
	 */
	KEYS(pattern: string): Promise<Set<string>> {
		return this.useCommand(input_keys(pattern));
	}

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
	COPY(
		source: string,
		destination: string,
		options?: CopyOptions,
	): Promise<boolean> {
		return this.useCommand(input_copy(source, destination, options));
	}

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
	EXPIREAT(key: string, timestamp: number, options?: ExpireatOptions): Promise<boolean> {
		return this.useCommand(input_expireat(key, timestamp, options));
	}

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
	PEXPIREAT(key: string, timestamp: number, options?: PexpireatOptions): Promise<boolean> {
		return this.useCommand(input_pexpireat(key, timestamp, options));
	}

	/**
	 * Remove the existing timeout on key, turning the key from volatile (a key with an expire set) to persistent (a key that will never expire as no timeout is associated).
	 *
	 * - Available since: 2.2.0.
	 * - Time complexity: O(1).
	 * @param key The key to persist.
	 * @returns Returns `true` if the timeout was removed. Returns `false` if the key does not exist or does not have an associated timeout.
	 * @see {@link https://redis.io/commands/persist}
	 */
	PERSIST(key: string): Promise<boolean> {
		return this.useCommand(input_persist(key));
	}

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
	EXPIRETIME(key: string): Promise<number> {
		return this.useCommand(input_expiretime(key));
	}

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
	RENAME(key: string, newkey: string): Promise<'OK'> {
		return this.useCommand(input_rename(key, newkey));
	}

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
	RENAMENX(key: string, newkey: string): Promise<'OK'> {
		return this.useCommand(input_renamenx(key, newkey));
	}

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
	PEXPIRETIME(key: string): Promise<number> {
		return this.useCommand(input_pexpiretime(key));
	}

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
	DEL(...keys: string[]): Promise<number> {
		return this.useCommand(input_del(...keys));
	}

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
	EXISTS(...keys: string[]): Promise<number> {
		return this.useCommand(input_exists(...keys));
	}

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
	LPUSH(
		key: string,
		...elements: (string | number)[]
	): Promise<number> {
		return this.useCommand(input_lpush(key, ...elements));
	}

	/**
	 * Returns the sorted set cardinality (number of elements) of the sorted set stored at key.
	 * - Available since: 1.2.0.
	 * - Time complexity: O(1).
	 * @param key Key holds a sorted set.
	 * @returns The cardinality (number of members) of the sorted set, or 0 if the key doesn't exist.
	 * @see {@link https://redis.io/commands/zcard}
	 */
	ZCARD(key: string): Promise<number> {
		return this.useCommand(input_zcard(key));
	}

	/**
	 * Returns the score of member in the sorted set at key.
	 * - Available since: 1.0.0.
	 * - Time complexity: O(1).
	 * @param key Key holds a sorted set.
	 * @param member Member in the sorted set.
	 * @returns The score of the member (a double-precision floating point number), represented as a string, or `null` if member does not exist in the sorted set, or the key does not exist.
	 * @see {@link https://redis.io/commands/zscore}
	 */
	ZSCORE(key: string, member: string | number): Promise<number | null> {
		return this.useCommand(input_zscore(key, member));
	}

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
	ZADD(
		key: string,
		score: number,
		member: string | number,
		options?: ZaddOptions,
	): Promise<number>;
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
	ZADD(
		key: string,
		pairs: Record<string, number>,
		options?: Omit<ZaddOptions, 'INCR'>,
	): Promise<number>;

	ZADD(
		key: string,
		arg1:
			| number
			| Record<string, number>,
		arg2?: string | number | ZaddOptions,
		arg3?: ZaddOptions,
	) {
		return this.useCommand(input_zadd(key, arg1, arg2, arg3));
	}

	/**
	 * Removes the specified members from the sorted set stored at key. Non existing members are ignored.
	 * - Available since: 1.2.0
	 * - Time complexity: O(M*log(N)) with N being the number of elements in the sorted set and M the number of elements to be removed.
	 * @param key Key holds a sorted set.
	 * @param members Members to remove.
	 * @returns The number of members removed from the sorted set, not including non-existing members.
	 * @see {@link https://redis.io/commands/zrem}
	 */
	ZREM(
		key: string,
		...members: (string | number)[]
	): Promise<number>;
	/**
	 * Removes the specified members from the sorted set stored at key. Non existing members are ignored.
	 * - Available since: 1.2.0
	 * - Time complexity: O(M*log(N)) with N being the number of elements in the sorted set and M the number of elements to be removed.
	 * @param key Key holds a sorted set.
	 * @param members Members to remove.
	 * @returns The number of members removed from the sorted set, not including non-existing members.
	 * @see {@link https://redis.io/commands/zrem}
	 */
	ZREM(
		key: string,
		members: (string | number)[] | Set<string> | IterableIterator<string>,
	): Promise<number>;

	ZREM(
		key: string,
		arg1: string | number | (string | number)[] | Set<string> | IterableIterator<string>,
		...args_rest: (string | number)[]
	): Promise<number> {
		return this.useCommand(input_zrem(key, arg1, ...args_rest));
	}

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
	ZRANGE(
		key: string,
		start: string | number,
		stop: string | number,
		options?: Omit<ZrangeOptions, 'WITHSCORES'>,
	): Promise<string[]>;
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
	ZRANGE(
		key: string,
		start: string | number,
		stop: string | number,
		options: ZrangeOptions,
	): Promise<{
		member: string,
		score: number,
	}[]>;

	ZRANGE(
		key: string,
		start: string | number,
		stop: string | number,
		options?: ZrangeOptions,
	) {
		return this.useCommand(input_zrange(key, start, stop, options));
	}

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
	ZINTERSTORE(
		destination: string,
		keys: (string | number)[],
		options?: ZinterstoreOptions,
	): Promise<number>;
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
	ZINTERSTORE(
		destination: string,
		keys_with_weights: Record<string, number>,
		options?: ZinterstoreOptions,
	): Promise<number>;

	ZINTERSTORE(
		destination: string,
		arg1: (string | number)[] | Record<string, number>,
		options?: ZinterstoreOptions,
	): Promise<number> {
		return this.useCommand(input_zinterstore(destination, arg1, options));
	}

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
	HSET(
		key: string,
		field: string,
		value: string | number,
	): Promise<number>;
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
	HSET(
		key: string,
		pairs: Record<
			string,
			string | number
		>
	): Promise<number>;

	HSET(
		key: string,
		arg1:
			| string
			| Record<
				string,
				string | number
			>,
		arg2?: string | number,
	) {
		return this.useCommand(input_hset(key, arg1, arg2));
	}

	/**
	 * Returns all fields and values of the hash stored at key.
	 * - Available since: 2.0.0.
	 * - Time complexity: O(N) where N is the size of the hash.
	 * @param key -
	 * @returns A record of fields and their values stored in the hash.
	 * @see {@link https://redis.io/commands/hgetall}
	 */
	HGETALL(key: string): Promise<Record<string, string>> {
		return this.useCommand(input_hgetall(key));
	}

	/**
	 * Returns the value associated with field in the hash stored at key.
	 * - Available since: 2.0.0.
	 * - Time complexity: O(1)
	 * @param key -
	 * @param field -
	 * @returns The value associated with field in the hash stored at key or null.
	 * @see {@link https://redis.io/commands/hget}
	 */
	HGET(key: string, field: string): Promise<string | null> {
		return this.useCommand(input_hget(key, field));
	}

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
	EVAL(
		script: string,
		keys: (string | number)[],
		args?: (string | number)[],
	): Promise<unknown> {
		return this.useCommand(input_eval(script, keys, args));
	}

	// MARK: end commands
}

// MARK: imports
import {
	input as input_msetnx,
} from './commands/string/msetnx.js';
import {
	input as input_setnx,
} from './commands/string/setnx.js';
import {
	input as input_get,
} from './commands/string/get.js';
import {
	type SetOptions,
	type SetOptionsGet,
	input as input_set,
} from './commands/string/set.js';
import {
	input as input_append,
} from './commands/string/append.js';
import {
	input as input_incr,
} from './commands/string/incr.js';
import {
	input as input_incrbyfloat,
} from './commands/string/incrbyfloat.js';
import {
	input as input_mget,
} from './commands/string/mget.js';
import {
	input as input_getdel,
} from './commands/string/getdel.js';
import {
	input as input_mset,
} from './commands/string/mset.js';
import {
	input as input_incrby,
} from './commands/string/incrby.js';
import {
	input as input_setrange,
} from './commands/string/setrange.js';
import {
	input as input_substr,
} from './commands/string/substr.js';
import {
	input as input_getset,
} from './commands/string/getset.js';
import {
	input as input_decrby,
} from './commands/string/decrby.js';
import {
	input as input_getrange,
} from './commands/string/getrange.js';
import {
	input as input_setex,
} from './commands/string/setex.js';
import {
	type GetexOptions,
	input as input_getex,
} from './commands/string/getex.js';
import {
	input as input_strlen,
} from './commands/string/strlen.js';
import {
	input as input_decr,
} from './commands/string/decr.js';
import {
	input as input_psetex,
} from './commands/string/psetex.js';
import {
	type PexpireOptions,
	input as input_pexpire,
} from './commands/generic/pexpire.js';
import {
	input as input_pttl,
} from './commands/generic/pttl.js';
import {
	input as input_ttl,
} from './commands/generic/ttl.js';
import {
	type ExpireOptions,
	input as input_expire,
} from './commands/generic/expire.js';
import {
	input as input_type,
} from './commands/generic/type.js';
import {
	input as input_keys,
} from './commands/generic/keys.js';
import {
	type CopyOptions,
	input as input_copy,
} from './commands/generic/copy.js';
import {
	type ExpireatOptions,
	input as input_expireat,
} from './commands/generic/expireat.js';
import {
	type PexpireatOptions,
	input as input_pexpireat,
} from './commands/generic/pexpireat.js';
import {
	input as input_persist,
} from './commands/generic/persist.js';
import {
	input as input_expiretime,
} from './commands/generic/expiretime.js';
import {
	input as input_rename,
} from './commands/generic/rename.js';
import {
	input as input_renamenx,
} from './commands/generic/renamenx.js';
import {
	input as input_pexpiretime,
} from './commands/generic/pexpiretime.js';
import {
	input as input_del,
} from './commands/generic/del.js';
import {
	input as input_exists,
} from './commands/generic/exists.js';
import {
	input as input_lpush,
} from './commands/list/lpush.js';
import {
	input as input_zcard,
} from './commands/sorted-set/zcard.js';
import {
	input as input_zscore,
} from './commands/sorted-set/zscore.js';
import {
	type ZaddOptions,
	input as input_zadd,
} from './commands/sorted-set/zadd.js';
import {
	input as input_zrem,
} from './commands/sorted-set/zrem.js';
import {
	type ZrangeOptions,
	input as input_zrange,
} from './commands/sorted-set/zrange.js';
import {
	type ZinterstoreOptions,
	input as input_zinterstore,
} from './commands/sorted-set/zinterstore.js';
import {
	input as input_hset,
} from './commands/hash/hset.js';
import {
	input as input_hgetall,
} from './commands/hash/hgetall.js';
import {
	input as input_hget,
} from './commands/hash/hget.js';
import {
	input as input_eval,
} from './commands/scripting/eval.js';
// MARK: end imports
