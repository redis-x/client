/* eslint-disable max-lines */

import { RedisXScript, type RedisXScriptOptions } from './script.js';
import { RedisXTransaction } from './transaction.js';
import type { Command, RedisClient } from './types.js';

export class RedisXClient {
	constructor(private redisClient: RedisClient) {}

	async sendCommand<T extends string>(
		command: T,
		...args: (string | number)[]
	): Promise<unknown> {
		return await this.redisClient.sendCommand([command, ...args.map(String)]);
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

	createScript(code: string): RedisXScript<string[], unknown>;
	createScript(code: string, keys: string[]): RedisXScript<string[], unknown>;
	createScript<O = unknown>(
		code: string,
		outputValidator: (value: unknown) => O,
	): RedisXScript<string[], O>;
	createScript<O = unknown>(
		code: string,
		keys: string[],
		outputValidator: (value: unknown) => O,
	): RedisXScript<string[], O>;
	createScript<
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		I extends any[] = string[],
		O = unknown,
	>(options: RedisXScriptOptions<I, O>): RedisXScript<I, O>;
	createScript<
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		I extends any[] = string[],
		O = unknown,
	>(
		arg_0: string | RedisXScriptOptions<I, O>,
		arg_1?: string[] | ((value: unknown) => O),
		arg_2?: (value: unknown) => O,
	): RedisXScript<I, O> {
		let options: RedisXScriptOptions<I, O>;
		if (typeof arg_0 === 'string') {
			options = {
				code: arg_0,
			};

			if (Array.isArray(arg_1)) {
				options.keys = arg_1;

				if (typeof arg_2 === 'function') {
					options.outputValidator = arg_2;
				}
			} else if (typeof arg_1 === 'function') {
				options.outputValidator = arg_1;
			}
		} else {
			options = arg_0;
		}

		return new RedisXScript(this.redisClient, options);
	}

	// MARK: commands
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

	SREM(
		key: string,
		...members: (string | number | (string | number)[])[]
	): Promise<number> {
		return this.useCommand(input_srem(key, ...members));
	}

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
	SMISMEMBER(key: string, ...members: string[]): Promise<boolean[]> {
		return this.useCommand(input_smismember(key, ...members));
	}

	/**
	 * Returns all the members of the set value stored at key.
	 *
	 * - Available since: 1.0.0.
	 * - Time complexity: O(N) where N is the set cardinality.
	 * @param key The key of the set.
	 * @returns A set with all the members of the set.
	 * @see {@link https://redis.io/commands/smembers}
	 */
	SMEMBERS(key: string): Promise<Set<string>> {
		return this.useCommand(input_smembers(key));
	}

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
	SISMEMBER(key: string, member: string): Promise<boolean> {
		return this.useCommand(input_sismember(key, member));
	}

	/**
	 * Returns the set cardinality (number of elements) of the set stored at key.
	 *
	 * - Available since: 1.0.0.
	 * - Time complexity: O(1).
	 * @param key The key of the set.
	 * @returns The cardinality (number of elements) of the set, or `0` if the key does not exist.
	 * @see {@link https://redis.io/commands/scard}
	 */
	SCARD(key: string): Promise<number> {
		return this.useCommand(input_scard(key));
	}

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

	SADD(
		key: string,
		...members: (string | number | (string | number)[])[]
	): Promise<number> {
		return this.useCommand(input_sadd(key, ...members));
	}

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
	SET(
		key: string,
		value: string | number,
		options: SetOptions,
	): Promise<'OK' | null>;
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
	SET(
		key: string,
		value: string | number,
		options: SetOptions & SetOptionsGet,
	): Promise<string | null>;

	SET(
		key: string,
		value: string | number,
		options?: SetOptions & Partial<SetOptionsGet>,
	) {
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
	MGET<const K extends string[]>(
		keys: K,
	): Promise<{ [I in keyof K]: string | null }>;
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
	MGET<const K extends string[]>(
		...keys: K
	): Promise<{ [I in keyof K]: string | null }>;

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
	PSETEX(
		key: string,
		milliseconds: number,
		value: string | number,
	): Promise<'OK'> {
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
	PEXPIRE(
		key: string,
		seconds: number,
		options?: PexpireOptions,
	): Promise<boolean> {
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
	EXPIRE(
		key: string,
		seconds: number,
		options?: ExpireOptions,
	): Promise<boolean> {
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
	TYPE(
		key: string,
	): Promise<
		'string' | 'list' | 'set' | 'zset' | 'hash' | 'stream' | 'vectorset'
	> {
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
	EXPIREAT(
		key: string,
		timestamp: number,
		options?: ExpireatOptions,
	): Promise<boolean> {
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
	PEXPIREAT(
		key: string,
		timestamp: number,
		options?: PexpireatOptions,
	): Promise<boolean> {
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

	RPUSH(
		key: string,
		...elements: (string | number | (string | number)[])[]
	): Promise<number> {
		return this.useCommand(input_rpush(key, ...elements));
	}

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

	LPOP(key: string, count?: number): Promise<string | string[] | null> {
		return this.useCommand(input_lpop(key, count));
	}

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
	RPOPLPUSH(source: string, destination: string): Promise<string | null> {
		return this.useCommand(input_rpoplpush(source, destination));
	}

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

	RPUSHX(
		key: string,
		...elements: (string | number | (string | number)[])[]
	): Promise<number> {
		return this.useCommand(input_rpushx(key, ...elements));
	}

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
	LSET(key: string, index: number, element: string | number): Promise<'OK'> {
		return this.useCommand(input_lset(key, index, element));
	}

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
	LREM(key: string, count: number, element: string | number): Promise<number> {
		return this.useCommand(input_lrem(key, count, element));
	}

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

	LPUSH(
		key: string,
		...elements: (string | number | (string | number)[])[]
	): Promise<number> {
		return this.useCommand(input_lpush(key, ...elements));
	}

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

	LPUSHX(
		key: string,
		...elements: (string | number | (string | number)[])[]
	): Promise<number> {
		return this.useCommand(input_lpushx(key, ...elements));
	}

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

	RPOP(key: string, count?: number): Promise<string | string[] | null> {
		return this.useCommand(input_rpop(key, count));
	}

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
	LRANGE(key: string, start: number, stop: number): Promise<string[]> {
		return this.useCommand(input_lrange(key, start, stop));
	}

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
	LLEN(key: string): Promise<number> {
		return this.useCommand(input_llen(key));
	}

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
	LINSERT(
		key: string,
		element: string | number,
		options:
			| {
					BEFORE: string | number;
			  }
			| {
					AFTER: string | number;
			  },
	): Promise<number> {
		return this.useCommand(input_linsert(key, element, options));
	}

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
	LTRIM(key: string, start: number, stop: number): Promise<'OK'> {
		return this.useCommand(input_ltrim(key, start, stop));
	}

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
	LINDEX(key: string, index: number): Promise<string | null> {
		return this.useCommand(input_lindex(key, index));
	}

	/**
	 * Returns the number of entries inside a stream. If the specified key does not exist
	 * the command returns zero, as if the stream was empty. However note that unlike other
	 * Redis types, zero-length streams are possible, so you should call TYPE or EXISTS in
	 * order to check if a key exists or not.
	 *
	 * Streams are not auto-deleted once they have no entries inside (for instance after an
	 * XDEL call), because the stream may have consumer groups associated with it.
	 *
	 * - Available since: 5.0.0.
	 * - Time complexity: O(1).
	 * @param key The key of the stream.
	 * @returns The number of entries of the stream at key.
	 * @see {@link https://redis.io/commands/xlen}
	 */
	XLEN(key: string): Promise<number> {
		return this.useCommand(input_xlen(key));
	}

	/**
	 * Removes the specified entries from a stream, and returns the number of entries deleted.
	 * This number may be less than the number of IDs passed to the command in the case where
	 * some of the specified IDs do not exist in the stream.
	 *
	 * - Available since: 5.0.0.
	 * - Time complexity: O(1) for each single item to delete in the stream, regardless of the stream size.
	 * @param key The key of the stream.
	 * @param ids The IDs of the entries to remove.
	 * @returns The number of entries actually deleted.
	 * @see {@link https://redis.io/commands/xdel}
	 */
	XDEL(key: string, ids: string[]): Promise<number>;
	/**
	 * Removes the specified entries from a stream, and returns the number of entries deleted.
	 * This number may be less than the number of IDs passed to the command in the case where
	 * some of the specified IDs do not exist in the stream.
	 *
	 * - Available since: 5.0.0.
	 * - Time complexity: O(1) for each single item to delete in the stream, regardless of the stream size.
	 * @param key The key of the stream.
	 * @param ids The IDs of the entries to remove.
	 * @returns The number of entries actually deleted.
	 * @see {@link https://redis.io/commands/xdel}
	 */
	XDEL(key: string, ...ids: string[]): Promise<number>;

	XDEL(key: string, ...ids: (string | string[])[]): Promise<number> {
		return this.useCommand(input_xdel(key, ...ids));
	}

	/**
	 * Read data from one or multiple streams, only returning entries with an ID greater than the last received ID reported by the caller.
	 *
	 * - Available since: 5.0.0.
	 * - Time complexity: O(N) where N is the number of entries returned.
	 * @param key The name of the stream to read from.
	 * @param id The last ID received from the stream.
	 * @param options Command options.
	 * @returns An array of stream entries or `null` if no entries are available.
	 * @see {@link https://redis.io/commands/xread}
	 */
	XREAD(
		key: string,
		id: XreadId,
		options?: XReadOptions,
	): Promise<XStreamEntry[]>;
	/**
	 * Read data from one or multiple streams, only returning entries with an ID greater than the last received ID reported by the caller.
	 *
	 * - Available since: 5.0.0.
	 * - Time complexity: O(N) where N is the number of entries returned.
	 * @param streams Object where keys are stream names and values are the last IDs received from those streams.
	 * @param options Command options.
	 * @returns An object where keys are stream names and values are arrays of stream entries or `null` if no entries are available.
	 * @see {@link https://redis.io/commands/xread}
	 */
	XREAD<const S extends Record<string, XreadId>>(
		streams: S,
		options?: XReadOptions,
	): Promise<{ [K in keyof S]: XStreamEntry[] }>;

	XREAD(
		arg0: string | Record<string, XreadId>,
		arg1?: XreadId | XReadOptions,
		arg2?: XReadOptions,
	): Promise<XStreamEntry[] | Record<string, XStreamEntry[] | null> | null> {
		return this.useCommand(input_xread(arg0, arg1, arg2));
	}

	/**
	 * Appends the specified stream entry to the stream at the specified key.
	 * If the key does not exist, as a side effect of running this command the key is created
	 * with a stream value. The creation of stream's key can be disabled with the NOMKSTREAM option.
	 * - Available since: 5.0.0.
	 * - Time complexity: O(1) when adding a new entry, O(N) when trimming where N being the number of entries evicted.
	 * @param key The key of the stream.
	 * @param id The ID of the entry to add. Use * to auto-generate an ID. You can also specify a custom ID.
	 * @param pairs A key-value pairs to add to the stream. Must be an even number of arguments.
	 * @returns The ID of the added entry.
	 * @see {@link https://redis.io/commands/xadd}
	 */
	XADD(key: string, id: XaddId, pairs: XaddPairs): Promise<string>;
	/**
	 * Appends the specified stream entry to the stream at the specified key.
	 * If the key does not exist, as a side effect of running this command the key is created
	 * with a stream value. The creation of stream's key can be disabled with the NOMKSTREAM option.
	 * - Available since: 5.0.0.
	 * - Time complexity: O(1) when adding a new entry, O(N) when trimming where N being the number of entries evicted.
	 * @param key The key of the stream.
	 * @param id The ID of the entry to add. Use * to auto-generate an ID. You can also specify a custom ID.
	 * @param pairs A key-value pairs to add to the stream. Must be an even number of arguments.
	 * @param options Command options.
	 * @returns The ID of the added entry.
	 * @see {@link https://redis.io/commands/xadd}
	 */
	XADD(
		key: string,
		id: XaddId,
		pairs: XaddPairs,
		options: XaddOptions,
	): Promise<string>;
	/**
	 * Appends the specified stream entry to the stream at the specified key.
	 * If the key does not exist, as a side effect of running this command the key is created
	 * with a stream value. The creation of stream's key can be disabled with the NOMKSTREAM option.
	 * - Available since: 5.0.0.
	 * - Time complexity: O(1) when adding a new entry, O(N) when trimming where N being the number of entries evicted.
	 * @param key The key of the stream.
	 * @param id The ID of the entry to add. Use * to auto-generate an ID. You can also specify a custom ID.
	 * @param pairs A key-value pairs to add to the stream. Must be an even number of arguments.
	 * @param options Command options.
	 * @returns The ID of the added entry, or `null` the key doesn't exist.
	 * @see {@link https://redis.io/commands/xadd}
	 */
	XADD(
		key: string,
		id: XaddId,
		pairs: XaddPairs,
		options: XaddOptions & XaddOptionsNomkstream,
	): Promise<string | null>;

	XADD(
		key: string,
		id: XaddId,
		pairs: XaddPairs,
		options?: XaddOptions & Partial<XaddOptionsNomkstream>,
	): Promise<string | null> {
		return this.useCommand(input_xadd(key, id, pairs, options));
	}

	/**
	 * Returns the stream entries matching a given range of IDs.
	 *
	 * The range is specified by a minimum and maximum ID. All the entries having an ID
	 * between the two specified or exactly one of the two IDs specified (closed interval)
	 * are returned.
	 *
	 * Special IDs `-` and `+` mean respectively the minimum ID possible and the maximum
	 * ID possible inside a stream.
	 *
	 * Exclusive ranges can be specified by prefixing the ID with `(`.
	 *
	 * - Available since: 5.0.0.
	 * - Time complexity: O(N) with N being the number of elements being returned. If N is constant (e.g. always asking for the first 10 elements with COUNT), you can consider it O(1).
	 * @param key Key that contains the stream.
	 * @param start Start ID for the range query. Use `-` for the minimum ID possible or prefix with `(` for exclusive range.
	 * @param end End ID for the range query. Use `+` for the maximum ID possible or prefix with `(` for exclusive range.
	 * @param options Command options.
	 * @returns An array of stream entries matching the range.
	 * @see {@link https://redis.io/commands/xrange}
	 */
	XRANGE(
		key: string,
		start: '-' | (string & {}),
		end: '+' | (string & {}),
		options?: XRangeOptions,
	): Promise<XStreamEntry[]> {
		return this.useCommand(input_xrange(key, start, end, options));
	}

	/**
	 * This command is exactly like XRANGE, but with the notable difference of returning the entries in reverse order,
	 * and also taking the start-end range in reverse order:
	 * in XREVRANGE you need to state the end ID and later the start ID,
	 * and the command will produce all the element between (or exactly like) the two IDs, starting from the end side.
	 *
	 * - Available since: 5.0.0.
	 * - Time complexity: O(N) with N being the number of elements being returned. If N is constant (e.g. always asking for the first 10 elements with COUNT), you can consider it O(1).
	 * @param key Key that contains the stream.
	 * @param end End ID for the range query. Use `+` for the maximum ID possible or prefix with `(` for exclusive range.
	 * @param start Start ID for the range query. Use `-` for the minimum ID possible or prefix with `(` for exclusive range.
	 * @param options Command options.
	 * @returns An array of stream entries matching the range.
	 * @see {@link https://redis.io/commands/xrange}
	 */
	XREVRANGE(
		key: string,
		end: '+' | (string & {}),
		start: '-' | (string & {}),
		options?: XRevrangeOptions,
	): Promise<XStreamEntry[]> {
		return this.useCommand(input_xrevrange(key, end, start, options));
	}

	/**
	 * Trims the stream by evicting older entries (entries with lower IDs) if needed.
	 *
	 * Using MAXLEN strategy which evicts entries as long as the stream's length exceeds the specified threshold.
	 *
	 * - Available since: 5.0.0.
	 * - Time complexity: O(N), with N being the number of evicted entries.
	 * @param key The key of the stream.
	 * @param strategy The MAXLEN trimming strategy.
	 * @param threshold A positive integer representing the max length.
	 * @param options Additional options.
	 * @returns The number of entries deleted from the stream.
	 * @see {@link https://redis.io/commands/xtrim}
	 */
	XTRIM(
		key: string,
		strategy: 'MAXLEN',
		threshold: number,
		options?: XtrimOptions,
	): Promise<number>;
	/**
	 * Trims the stream by evicting older entries (entries with lower IDs) if needed.
	 *
	 * Using MINID strategy which evicts entries with IDs lower than threshold.
	 *
	 * - Available since: 6.2.0.
	 * - Time complexity: O(N), with N being the number of evicted entries.
	 * @param key The key of the stream.
	 * @param strategy The MINID trimming strategy.
	 * @param threshold A stream ID threshold in the format of "timestamp-sequence" or "timestamp".
	 * @param options Additional options.
	 * @returns The number of entries deleted from the stream.
	 * @see {@link https://redis.io/commands/xtrim}
	 */
	XTRIM(
		key: string,
		strategy: 'MINID',
		threshold: string,
		options?: XtrimOptions,
	): Promise<number>;

	XTRIM(
		key: string,
		strategy: 'MAXLEN' | 'MINID',
		threshold: number | string,
		options?: XtrimOptions,
	): Promise<number> {
		return this.useCommand(input_xtrim(key, strategy, threshold, options));
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
	 * Returns all the elements in the sorted set at key with a score between min and max (including elements with score equal to min or max).
	 * The elements are considered to be ordered from low to high scores.
	 *
	 * The elements having the same score are returned in lexicographical order.
	 *
	 * - Available since: 1.0.5.
	 * - Time complexity: O(log(N)+M) with N being the number of elements in the sorted set and M the number of elements being returned. If M is constant (e.g. always asking for the first 10 elements with LIMIT), you can consider it O(log(N)).
	 * @deprecated As of Redis version 6.2.0, this command is regarded as deprecated. It can be replaced by ZRANGE with the BYSCORE argument when migrating or writing new code.
	 * @param key The key of the sorted set.
	 * @param min The minimum score to consider.
	 * @param max The maximum score to consider.
	 * @param options Additional options for the command.
	 * @returns Array of elements in the specified score range.
	 * @see {@link https://redis.io/commands/zrangebyscore}
	 */
	ZRANGEBYSCORE(
		key: string,
		min: number | `(${number}` | '-inf',
		max: number | `(${number}` | '+inf',
		options?: ZrangebyscoreOptions,
	): Promise<string[]>;
	/**
	 * Returns all the elements in the sorted set at key with a score between min and max (including elements with score equal to min or max).
	 * The elements are considered to be ordered from low to high scores.
	 *
	 * The elements having the same score are returned in lexicographical order.
	 *
	 * - Available since: 1.0.5.
	 * - Time complexity: O(log(N)+M) with N being the number of elements in the sorted set and M the number of elements being returned. If M is constant (e.g. always asking for the first 10 elements with LIMIT), you can consider it O(log(N)).
	 * @deprecated As of Redis version 6.2.0, this command is regarded as deprecated. It can be replaced by ZRANGE with the BYSCORE argument when migrating or writing new code.
	 * @param key The key of the sorted set.
	 * @param min The minimum score to consider.
	 * @param max The maximum score to consider.
	 * @param options Additional options for the command with WITHSCORES set to true.
	 * @returns Array of elements with their scores in the specified score range.
	 * @see {@link https://redis.io/commands/zrangebyscore}
	 */
	ZRANGEBYSCORE(
		key: string,
		min: number | `(${number}` | '-inf',
		max: number | `(${number}` | '+inf',
		options: ZrangebyscoreOptions & ZrangebyscoreOptionsWithscores,
	): Promise<
		{
			member: string;
			score: number;
		}[]
	>;

	ZRANGEBYSCORE(
		key: string,
		min: number | `(${number}` | '-inf',
		max: number | `(${number}` | '+inf',
		options?: ZrangebyscoreOptions & Partial<ZrangebyscoreOptionsWithscores>,
	) {
		return this.useCommand(input_zrangebyscore(key, min, max, options));
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
	 * Returns the number of elements in the sorted set at key with a score between min and max.
	 *
	 * The min and max arguments have the same semantic as described for ZRANGEBYSCORE.
	 *
	 * Note: the command has a complexity of just O(log(N)) because it uses elements ranks (see ZRANK) to get an idea of the range.
	 * Because of this there is no need to do a work proportional to the size of the range.
	 * - Available since: 2.0.0.
	 * - Time complexity: O(log(N)) with N being the number of elements in the sorted set.
	 * @param key The key of the sorted set.
	 * @param min The minimum score to include in the count. Can be "-inf" for negative infinity, or a number prefixed with "(" to exclude that value.
	 * @param max The maximum score to include in the count. Can be "+inf" for positive infinity, or a number prefixed with "(" to exclude that value.
	 * @returns The number of elements in the specified score range.
	 * @see {@link https://redis.io/commands/zcount}
	 */
	ZCOUNT(
		key: string,
		min: number | `(${number}` | '-inf',
		max: number | `(${number}` | '+inf',
	): Promise<number> {
		return this.useCommand(input_zcount(key, min, max));
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
		arg1: number | Record<string, number>,
		arg2?: string | number | ZaddOptions,
		arg3?: ZaddOptions,
	) {
		return this.useCommand(input_zadd(key, arg1, arg2, arg3));
	}

	/**
	 * Returns the rank of member in the sorted set stored at key, with the scores ordered from low to high.
	 * The rank (or index) is 0-based, which means that the member with the lowest score has rank 0.
	 *
	 * - Available since: 2.0.0.
	 * - Time complexity: O(log(N)).
	 * @param key Key of the sorted set.
	 * @param member Member to get the rank for.
	 * @returns The rank of member if member exists in the sorted set, or null if member does not exist in the sorted set or key does not exist.
	 * @see {@link https://redis.io/commands/zrank}
	 */
	ZRANK(key: string, member: string | number): Promise<number | null>;
	/**
	 * Returns the rank of member in the sorted set stored at key, with the scores ordered from low to high.
	 * The rank (or index) is 0-based, which means that the member with the lowest score has rank 0.
	 *
	 * - Available since: 2.0.0.
	 * - Time complexity: O(log(N)).
	 * @param key Key of the sorted set.
	 * @param member Member to get the rank for.
	 * @param options Command options.
	 * @returns The rank and score of member if member exists in the sorted set, or null if member does not exist in the sorted set or key does not exist.
	 * @see {@link https://redis.io/commands/zrank}
	 */
	ZRANK(
		key: string,
		member: string | number,
		options: ZrankOptionsWithscore,
	): Promise<{
		rank: number;
		score: number;
	} | null>;

	ZRANK(
		key: string,
		member: string | number,
		options?: Partial<ZrankOptionsWithscore>,
	) {
		return this.useCommand(input_zrank(key, member, options));
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
	ZREM(
		key: string,
		members: (string | number)[] | Set<string> | IterableIterator<string>,
	): Promise<number>;

	ZREM(
		key: string,
		arg1:
			| string
			| number
			| (string | number)[]
			| Set<string>
			| IterableIterator<string>,
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
	): Promise<
		{
			member: string;
			score: number;
		}[]
	>;

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
	 * Returns all the elements in the sorted set at `key` with a value between `min` and `max`.
	 *
	 * The elements are considered to be ordered from lower to higher strings as compared byte-by-byte using the `memcmp()` C function.
	 * Longer strings are considered greater than shorter strings if the common part is identical.
	 *
	 * Valid `min` and `max` must start with `(` or `[`, in order to specify if the range item is respectively exclusive or inclusive.
	 * The special values of `+` or `-` for `min` and `max` have the special meaning or positively infinite and negatively infinite strings.
	 *
	 * - Available since: 2.8.9.
	 * - Time complexity: O(log(N)+M) with N being the number of elements in the sorted set and M the number of elements being returned. If M is constant (e.g. always asking for the first 10 elements with LIMIT), you can consider it O(log(N)).
	 * @deprecated As of Redis version 6.2.0, this command is regarded as deprecated. It can be replaced by ZRANGE with the BYLEX argument when migrating or writing new code.
	 * @param key The key of the sorted set.
	 * @param min Minimum value of the range.
	 * @param max Maximum value of the range.
	 * @param options Command options.
	 * @returns List of elements in the specified range.
	 * @see {@link https://redis.io/commands/zrangebylex}
	 */
	ZRANGEBYLEX(
		key: string,
		min: `(${string}` | `[${string}` | '-',
		max: `(${string}` | `[${string}` | '+',
		options?: ZrangebylexOptions,
	): Promise<string[]> {
		return this.useCommand(input_zrangebylex(key, min, max, options));
	}

	/**
	 * Returns all values in the hash stored at key.
	 * - Available since: 2.0.0.
	 * - Time complexity: O(N) where N is the size of the hash.
	 * @param key The key of the hash.
	 * @returns A set of values in the hash, or an empty set when the key does not exist.
	 * @see {@link https://redis.io/commands/hvals}
	 */
	HVALS(key: string): Promise<Set<string>> {
		return this.useCommand(input_hvals(key));
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

	HSET(
		key: string,
		arg1: string | Record<string, string | number>,
		arg2?: string | number,
	) {
		return this.useCommand(input_hset(key, arg1, arg2));
	}

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
	HINCRBYFLOAT(
		key: string,
		field: string | number,
		increment: number,
	): Promise<string> {
		return this.useCommand(input_hincrbyfloat(key, field, increment));
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
	HMSET(key: string, field: string, value: string | number): Promise<'OK'>;
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
	HMSET(key: string, pairs: Record<string, string | number>): Promise<'OK'>;

	HMSET(
		key: string,
		arg1: string | Record<string, string | number>,
		arg2?: string | number,
	): Promise<'OK'> {
		return this.useCommand(input_hmset(key, arg1, arg2));
	}

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

	HMGET(
		key: string,
		...fields: (string | string[])[]
	): Promise<(string | null)[]> {
		return this.useCommand(input_hmget(key, ...fields));
	}

	/**
	 * Returns the number of fields contained in the hash stored at key.
	 *
	 * - Available since: 2.0.0.
	 * - Time complexity: O(1).
	 * @param key Key to get hash length.
	 * @returns The number of fields in the hash, or 0 when the key does not exist.
	 * @see {@link https://redis.io/commands/hlen}
	 */
	HLEN(key: string): Promise<number> {
		return this.useCommand(input_hlen(key));
	}

	/**
	 * Returns all field names in the hash stored at key.
	 *
	 * - Available since: 2.0.0.
	 * - Time complexity: O(N) where N is the size of the hash.
	 * @param key The key of the hash.
	 * @returns A set of fields in the hash, or an empty set when the key does not exist.
	 * @see {@link https://redis.io/commands/hkeys}
	 */
	HKEYS(key: string): Promise<Set<string>> {
		return this.useCommand(input_hkeys(key));
	}

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
	HINCRBY(
		key: string,
		field: string | number,
		increment: number,
	): Promise<number> {
		return this.useCommand(input_hincrby(key, field, increment));
	}

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

	HDEL(
		key: string,
		...fields: (string | number | (string | number)[])[]
	): Promise<number> {
		return this.useCommand(input_hdel(key, ...fields));
	}

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
	HSTRLEN(key: string, field: string): Promise<number> {
		return this.useCommand(input_hstrlen(key, field));
	}

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
	HEXISTS(key: string, field: string | number): Promise<boolean> {
		return this.useCommand(input_hexists(key, field));
	}

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
	HSETNX(key: string, field: string, value: string | number): Promise<boolean> {
		return this.useCommand(input_hsetnx(key, field, value));
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

import { input as input_srem } from './commands/set/srem.js';
import { input as input_smismember } from './commands/set/smismember.js';
import { input as input_smembers } from './commands/set/smembers.js';
import { input as input_sismember } from './commands/set/sismember.js';
import { input as input_scard } from './commands/set/scard.js';
import { input as input_sadd } from './commands/set/sadd.js';
import { input as input_msetnx } from './commands/string/msetnx.js';
import { input as input_setnx } from './commands/string/setnx.js';
import { input as input_get } from './commands/string/get.js';
import {
	type SetOptions,
	type SetOptionsGet,
	input as input_set,
} from './commands/string/set.js';
import { input as input_append } from './commands/string/append.js';
import { input as input_incr } from './commands/string/incr.js';
import { input as input_incrbyfloat } from './commands/string/incrbyfloat.js';
import { input as input_mget } from './commands/string/mget.js';
import { input as input_getdel } from './commands/string/getdel.js';
import { input as input_mset } from './commands/string/mset.js';
import { input as input_incrby } from './commands/string/incrby.js';
import { input as input_setrange } from './commands/string/setrange.js';
import { input as input_substr } from './commands/string/substr.js';
import { input as input_getset } from './commands/string/getset.js';
import { input as input_decrby } from './commands/string/decrby.js';
import { input as input_getrange } from './commands/string/getrange.js';
import { input as input_setex } from './commands/string/setex.js';
import {
	type GetexOptions,
	input as input_getex,
} from './commands/string/getex.js';
import { input as input_strlen } from './commands/string/strlen.js';
import { input as input_decr } from './commands/string/decr.js';
import { input as input_psetex } from './commands/string/psetex.js';
import {
	type PexpireOptions,
	input as input_pexpire,
} from './commands/generic/pexpire.js';
import { input as input_pttl } from './commands/generic/pttl.js';
import { input as input_ttl } from './commands/generic/ttl.js';
import {
	type ExpireOptions,
	input as input_expire,
} from './commands/generic/expire.js';
import { input as input_type } from './commands/generic/type.js';
import { input as input_keys } from './commands/generic/keys.js';
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
import { input as input_persist } from './commands/generic/persist.js';
import { input as input_expiretime } from './commands/generic/expiretime.js';
import { input as input_rename } from './commands/generic/rename.js';
import { input as input_renamenx } from './commands/generic/renamenx.js';
import { input as input_pexpiretime } from './commands/generic/pexpiretime.js';
import { input as input_del } from './commands/generic/del.js';
import { input as input_exists } from './commands/generic/exists.js';
import { input as input_rpush } from './commands/list/rpush.js';
import { input as input_lpop } from './commands/list/lpop.js';
import { input as input_rpoplpush } from './commands/list/rpoplpush.js';
import { input as input_rpushx } from './commands/list/rpushx.js';
import { input as input_lset } from './commands/list/lset.js';
import { input as input_lrem } from './commands/list/lrem.js';
import { input as input_lpush } from './commands/list/lpush.js';
import { input as input_lpushx } from './commands/list/lpushx.js';
import { input as input_rpop } from './commands/list/rpop.js';
import { input as input_lrange } from './commands/list/lrange.js';
import { input as input_llen } from './commands/list/llen.js';
import { input as input_linsert } from './commands/list/linsert.js';
import { input as input_ltrim } from './commands/list/ltrim.js';
import { input as input_lindex } from './commands/list/lindex.js';
import { input as input_xlen } from './commands/stream/xlen.js';
import { input as input_xdel } from './commands/stream/xdel.js';
import {
	type XreadId,
	type XReadOptions,
	type XStreamEntry,
	input as input_xread,
} from './commands/stream/xread.js';
import {
	type XaddId,
	type XaddPairs,
	type XaddOptions,
	type XaddOptionsNomkstream,
	input as input_xadd,
} from './commands/stream/xadd.js';
import {
	type XRangeOptions,
	input as input_xrange,
} from './commands/stream/xrange.js';
import {
	type XRevrangeOptions,
	input as input_xrevrange,
} from './commands/stream/xrevrange.js';
import {
	type XtrimOptions,
	input as input_xtrim,
} from './commands/stream/xtrim.js';
import { input as input_zcard } from './commands/sorted-set/zcard.js';
import {
	type ZrangebyscoreOptions,
	type ZrangebyscoreOptionsWithscores,
	input as input_zrangebyscore,
} from './commands/sorted-set/zrangebyscore.js';
import { input as input_zscore } from './commands/sorted-set/zscore.js';
import { input as input_zcount } from './commands/sorted-set/zcount.js';
import {
	type ZaddOptions,
	input as input_zadd,
} from './commands/sorted-set/zadd.js';
import {
	type ZrankOptionsWithscore,
	input as input_zrank,
} from './commands/sorted-set/zrank.js';
import { input as input_zrem } from './commands/sorted-set/zrem.js';
import {
	type ZrangeOptions,
	input as input_zrange,
} from './commands/sorted-set/zrange.js';
import {
	type ZinterstoreOptions,
	input as input_zinterstore,
} from './commands/sorted-set/zinterstore.js';
import {
	type ZrangebylexOptions,
	input as input_zrangebylex,
} from './commands/sorted-set/zrangebylex.js';
import { input as input_hvals } from './commands/hash/hvals.js';
import { input as input_hset } from './commands/hash/hset.js';
import { input as input_hincrbyfloat } from './commands/hash/hincrbyfloat.js';
import { input as input_hgetall } from './commands/hash/hgetall.js';
import { input as input_hget } from './commands/hash/hget.js';
import { input as input_hmset } from './commands/hash/hmset.js';
import { input as input_hmget } from './commands/hash/hmget.js';
import { input as input_hlen } from './commands/hash/hlen.js';
import { input as input_hkeys } from './commands/hash/hkeys.js';
import { input as input_hincrby } from './commands/hash/hincrby.js';
import { input as input_hdel } from './commands/hash/hdel.js';
import { input as input_hstrlen } from './commands/hash/hstrlen.js';
import { input as input_hexists } from './commands/hash/hexists.js';
import { input as input_hsetnx } from './commands/hash/hsetnx.js';
import { input as input_eval } from './commands/scripting/eval.js';

// MARK: end imports
