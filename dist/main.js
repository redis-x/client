//#region src/utils.ts
/**
* Checks if a value is a plain object.
* @param value Value to check.
* @returns -
*/
function isPlainObject(value) {
	return typeof value === "object" && value !== null && Array.isArray(value) !== true && value.constructor === Object && Object.getPrototypeOf(value) === Object.prototype;
}
/**
* Converts a string array to an object.
* @param values A flat array containing the keys and the values.
* @returns Object with keys and values.
*/
function stringBulkToObject(values) {
	const object = {};
	for (let index = 0; index < values.length; index += 2) object[values[index]] = values[index + 1];
	return object;
}

//#endregion
//#region src/transaction/command.ts
var RedisXTransactionCommand = class {
	constructor(index) {
		this.index = index;
	}
};
/**
* Recursively walks through the object and unwraps all RedisTransactionCommand instances.
* @param target Value to unwrap.
* @param result Result of the transaction.
* @returns The unwrapped value.
*/
function unwrapRedisTransactionCommand(target, result) {
	if (target instanceof RedisXTransactionCommand) return result[target.index];
	if (Array.isArray(target)) for (const [index, value] of target.entries()) target[index] = unwrapRedisTransactionCommand(value, result);
	else if (isPlainObject(target)) for (const [key, value] of Object.entries(target)) target[key] = unwrapRedisTransactionCommand(value, result);
	return target;
}

//#endregion
//#region src/commands/set/srem.ts
function input$86(key, ...members) {
	return {
		kind: "#schema",
		args: [
			"SREM",
			key,
			...members.flat().map(String)
		]
	};
}

//#endregion
//#region src/commands/set/smismember.ts
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
function input$85(key, ...members) {
	return {
		kind: "#schema",
		args: [
			"SMISMEMBER",
			key,
			...members
		],
		replyTransform: replyTransform$2
	};
}
/**
* Converts an array of numbers (0 or 1) to an array of booleans.
* @param reply The array of numbers to convert.
* @returns An array of booleans where 1 becomes true and 0 becomes false.
*/
function replyTransform$2(reply) {
	return reply.map((value) => value === 1);
}

//#endregion
//#region src/reply-transformers/array-to-set.ts
/**
* Converts an array of strings to a Set of strings.
* @param reply The array of strings to convert.
* @returns A Set containing the unique strings from the array.
*/
function replyTransform$1(reply) {
	return new Set(reply);
}

//#endregion
//#region src/commands/set/smembers.ts
/**
* Returns all the members of the set value stored at key.
*
* - Available since: 1.0.0.
* - Time complexity: O(N) where N is the set cardinality.
* @param key The key of the set.
* @returns A set with all the members of the set.
* @see {@link https://redis.io/commands/smembers}
*/
function input$84(key) {
	return {
		kind: "#schema",
		args: ["SMEMBERS", key],
		replyTransform: replyTransform$1
	};
}

//#endregion
//#region src/reply-transformers/number-to-boolean.ts
/**
* Converts a number to a boolean.
* @param reply The number to convert (0 or 1).
* @returns Returns true if the number is 1, false if it is 0.
*/
function replyTransform(reply) {
	return reply === 1;
}

//#endregion
//#region src/commands/set/sismember.ts
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
function input$83(key, member) {
	return {
		kind: "#schema",
		args: [
			"SISMEMBER",
			key,
			member
		],
		replyTransform
	};
}

//#endregion
//#region src/commands/set/scard.ts
/**
* Returns the set cardinality (number of elements) of the set stored at key.
*
* - Available since: 1.0.0.
* - Time complexity: O(1).
* @param key The key of the set.
* @returns The cardinality (number of elements) of the set, or `0` if the key does not exist.
* @see {@link https://redis.io/commands/scard}
*/
function input$82(key) {
	return {
		kind: "#schema",
		args: ["SCARD", key]
	};
}

//#endregion
//#region src/commands/set/sadd.ts
function input$81(key, ...members) {
	return {
		kind: "#schema",
		args: [
			"SADD",
			key,
			...members.flat().map(String)
		]
	};
}

//#endregion
//#region src/commands/string/msetnx.ts
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
function input$80(pairs) {
	const args = ["MSETNX"];
	for (const [key, value] of Object.entries(pairs)) args.push(key, String(value));
	return {
		kind: "#schema",
		args,
		replyTransform
	};
}

//#endregion
//#region src/commands/string/setnx.ts
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
function input$79(key, value) {
	return {
		kind: "#schema",
		args: [
			"SETNX",
			key,
			String(value)
		],
		replyTransform
	};
}

//#endregion
//#region src/commands/string/get.ts
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
function input$78(key) {
	return {
		kind: "#schema",
		args: ["GET", key]
	};
}

//#endregion
//#region src/commands/string/set.ts
function input$77(key, value, options) {
	const args_options = [];
	if (options) {
		if (options.NX) args_options.push("NX");
		if (options.XX) args_options.push("XX");
		if (options.EX) args_options.push("EX", String(options.EX));
		if (options.PX) args_options.push("PX", String(options.PX));
		if (options.EXAT) args_options.push("EXAT", String(options.EXAT));
		if (options.PXAT) args_options.push("PXAT", String(options.PXAT));
		if (options.KEEPTTL) args_options.push("KEEPTTL");
		if (options.GET) args_options.push("GET");
	}
	return {
		kind: "#schema",
		args: [
			"SET",
			key,
			String(value),
			...args_options
		]
	};
}

//#endregion
//#region src/commands/string/append.ts
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
function input$76(key, value) {
	return {
		kind: "#schema",
		args: [
			"APPEND",
			key,
			value
		]
	};
}

//#endregion
//#region src/commands/string/incr.ts
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
function input$75(key) {
	return {
		kind: "#schema",
		args: ["INCR", key]
	};
}

//#endregion
//#region src/commands/string/incrbyfloat.ts
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
function input$74(key, increment) {
	return {
		kind: "#schema",
		args: [
			"INCRBYFLOAT",
			key,
			String(increment)
		]
	};
}

//#endregion
//#region src/commands/string/mget.ts
function input$73(...args) {
	return {
		kind: "#schema",
		args: ["MGET", ...args.flat()]
	};
}

//#endregion
//#region src/commands/string/getdel.ts
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
function input$72(key) {
	return {
		kind: "#schema",
		args: ["GETDEL", key]
	};
}

//#endregion
//#region src/commands/string/mset.ts
/**
* Sets the given keys to their respective values. MSET replaces existing values with new values, just as regular SET.
* MSET is atomic, so all given keys are set at once. It is not possible for clients to see that some of the keys were updated while others are unchanged.
* - Available since: 1.0.1.
* - Time complexity: O(N) where N is the number of keys to set.
* @param pairs A record of key-value pairs.
* @returns "OK"
* @see {@link https://redis.io/commands/mset}
*/
function input$71(pairs) {
	const args = ["MSET"];
	for (const [key, value] of Object.entries(pairs)) args.push(key, String(value));
	return {
		kind: "#schema",
		args
	};
}

//#endregion
//#region src/commands/string/incrby.ts
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
function input$70(key, increment) {
	return {
		kind: "#schema",
		args: [
			"INCRBY",
			key,
			String(increment)
		]
	};
}

//#endregion
//#region src/commands/string/setrange.ts
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
function input$69(key, offset, value) {
	return {
		kind: "#schema",
		args: [
			"SETRANGE",
			key,
			String(offset),
			value
		]
	};
}

//#endregion
//#region src/commands/string/substr.ts
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
function input$68(key, start, end) {
	return {
		kind: "#schema",
		args: [
			"SUBSTR",
			key,
			String(start),
			String(end)
		]
	};
}

//#endregion
//#region src/commands/string/getset.ts
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
function input$67(key, value) {
	return {
		kind: "#schema",
		args: [
			"GETSET",
			key,
			String(value)
		]
	};
}

//#endregion
//#region src/commands/string/decrby.ts
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
function input$66(key, decrement) {
	return {
		kind: "#schema",
		args: [
			"DECRBY",
			key,
			String(decrement)
		]
	};
}

//#endregion
//#region src/commands/string/getrange.ts
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
function input$65(key, start, end) {
	return {
		kind: "#schema",
		args: [
			"GETRANGE",
			key,
			String(start),
			String(end)
		]
	};
}

//#endregion
//#region src/commands/string/setex.ts
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
function input$64(key, seconds, value) {
	return {
		kind: "#schema",
		args: [
			"SETEX",
			key,
			String(seconds),
			String(value)
		]
	};
}

//#endregion
//#region src/commands/string/getex.ts
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
function input$63(key, options) {
	const args_options = [];
	if (options) {
		if (options.EX !== void 0) args_options.push("EX", String(options.EX));
		if (options.PX !== void 0) args_options.push("PX", String(options.PX));
		if (options.EXAT !== void 0) args_options.push("EXAT", String(options.EXAT));
		if (options.PXAT !== void 0) args_options.push("PXAT", String(options.PXAT));
		if (options.PERSIST) args_options.push("PERSIST");
	}
	return {
		kind: "#schema",
		args: [
			"GETEX",
			key,
			...args_options
		]
	};
}

//#endregion
//#region src/commands/string/strlen.ts
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
function input$62(key) {
	return {
		kind: "#schema",
		args: ["STRLEN", key]
	};
}

//#endregion
//#region src/commands/string/decr.ts
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
function input$61(key) {
	return {
		kind: "#schema",
		args: ["DECR", key]
	};
}

//#endregion
//#region src/commands/string/psetex.ts
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
function input$60(key, milliseconds, value) {
	return {
		kind: "#schema",
		args: [
			"PSETEX",
			key,
			String(milliseconds),
			String(value)
		]
	};
}

//#endregion
//#region src/commands/generic/pexpire.ts
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
function input$59(key, seconds, options) {
	const args_options = [];
	if (options) {
		if (options.NX) args_options.push("NX");
		if (options.XX) args_options.push("XX");
		if (options.GT) args_options.push("GT");
		if (options.LT) args_options.push("LT");
	}
	return {
		kind: "#schema",
		args: [
			"PEXPIRE",
			key,
			String(seconds),
			...args_options
		],
		replyTransform
	};
}

//#endregion
//#region src/commands/generic/pttl.ts
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
function input$58(key) {
	return {
		kind: "#schema",
		args: ["PTTL", key]
	};
}

//#endregion
//#region src/commands/generic/ttl.ts
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
function input$57(key) {
	return {
		kind: "#schema",
		args: ["TTL", key]
	};
}

//#endregion
//#region src/commands/generic/expire.ts
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
function input$56(key, seconds, options) {
	const args_options = [];
	if (options) {
		if (options.NX) args_options.push("NX");
		if (options.XX) args_options.push("XX");
		if (options.GT) args_options.push("GT");
		if (options.LT) args_options.push("LT");
	}
	return {
		kind: "#schema",
		args: [
			"EXPIRE",
			key,
			String(seconds),
			...args_options
		],
		replyTransform
	};
}

//#endregion
//#region src/commands/generic/type.ts
/**
* Returns the string representation of the type of the value stored at `key`.
* - Available since: 1.0.0.
* - Time complexity: O(1).
* @param key The key to check.
* @returns "OK".
* @see {@link https://redis.io/commands/rename}
*/
function input$55(key) {
	return {
		kind: "#schema",
		args: ["TYPE", key]
	};
}

//#endregion
//#region src/commands/generic/keys.ts
/**
* Returns all keys matching pattern.
* - Available since: 1.0.0.
* - Time complexity: O(N) with N being the number of keys in the database.
* @param pattern Pattern to match.
* @returns A set of keys matching pattern.
* @see {@link https://redis.io/commands/keys}
*/
function input$54(pattern) {
	return {
		kind: "#schema",
		args: ["KEYS", pattern],
		replyTransform: replyTransform$1
	};
}

//#endregion
//#region src/commands/generic/copy.ts
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
function input$53(source, destination, options) {
	const args = [
		"COPY",
		source,
		destination
	];
	if ((options === null || options === void 0 ? void 0 : options.DB) !== void 0) args.push("DB", String(options.DB));
	if (options === null || options === void 0 ? void 0 : options.REPLACE) args.push("REPLACE");
	return {
		kind: "#schema",
		args,
		replyTransform
	};
}

//#endregion
//#region src/commands/generic/expireat.ts
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
function input$52(key, timestamp, options) {
	const args_options = [];
	if (options) {
		if (options.NX) args_options.push("NX");
		if (options.XX) args_options.push("XX");
		if (options.GT) args_options.push("GT");
		if (options.LT) args_options.push("LT");
	}
	return {
		kind: "#schema",
		args: [
			"EXPIREAT",
			key,
			String(timestamp),
			...args_options
		],
		replyTransform
	};
}

//#endregion
//#region src/commands/generic/pexpireat.ts
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
function input$51(key, timestamp, options) {
	const args_options = [];
	if (options) {
		if (options.NX) args_options.push("NX");
		if (options.XX) args_options.push("XX");
		if (options.GT) args_options.push("GT");
		if (options.LT) args_options.push("LT");
	}
	return {
		kind: "#schema",
		args: [
			"PEXPIREAT",
			key,
			String(timestamp),
			...args_options
		],
		replyTransform
	};
}

//#endregion
//#region src/commands/generic/persist.ts
/**
* Remove the existing timeout on key, turning the key from volatile (a key with an expire set) to persistent (a key that will never expire as no timeout is associated).
*
* - Available since: 2.2.0.
* - Time complexity: O(1).
* @param key The key to persist.
* @returns Returns `true` if the timeout was removed. Returns `false` if the key does not exist or does not have an associated timeout.
* @see {@link https://redis.io/commands/persist}
*/
function input$50(key) {
	return {
		kind: "#schema",
		args: ["PERSIST", key],
		replyTransform
	};
}

//#endregion
//#region src/commands/generic/expiretime.ts
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
function input$49(key) {
	return {
		kind: "#schema",
		args: ["EXPIRETIME", key]
	};
}

//#endregion
//#region src/commands/generic/rename.ts
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
function input$48(key, newkey) {
	return {
		kind: "#schema",
		args: [
			"RENAME",
			key,
			newkey
		]
	};
}

//#endregion
//#region src/commands/generic/renamenx.ts
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
function input$47(key, newkey) {
	return {
		kind: "#schema",
		args: [
			"RENAMENX",
			key,
			newkey
		]
	};
}

//#endregion
//#region src/commands/generic/pexpiretime.ts
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
function input$46(key) {
	return {
		kind: "#schema",
		args: ["PEXPIRETIME", key]
	};
}

//#endregion
//#region src/commands/generic/del.ts
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
function input$45(...keys) {
	return {
		kind: "#schema",
		args: ["DEL", ...keys]
	};
}

//#endregion
//#region src/commands/generic/exists.ts
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
function input$44(...keys) {
	return {
		kind: "#schema",
		args: ["EXISTS", ...keys]
	};
}

//#endregion
//#region src/commands/list/rpush.ts
function input$43(key, ...elements) {
	return {
		kind: "#schema",
		args: [
			"RPUSH",
			key,
			...elements.flat().map(String)
		]
	};
}

//#endregion
//#region src/commands/list/lpop.ts
function input$42(key, count) {
	if (count !== void 0) return {
		kind: "#schema",
		args: [
			"LPOP",
			key,
			String(count)
		]
	};
	return {
		kind: "#schema",
		args: ["LPOP", key]
	};
}

//#endregion
//#region src/commands/list/rpoplpush.ts
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
function input$41(source, destination) {
	return {
		kind: "#schema",
		args: [
			"RPOPLPUSH",
			source,
			destination
		]
	};
}

//#endregion
//#region src/commands/list/rpushx.ts
function input$40(key, ...elements) {
	return {
		kind: "#schema",
		args: [
			"RPUSHX",
			key,
			...elements.flat().map(String)
		]
	};
}

//#endregion
//#region src/commands/list/lset.ts
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
function input$39(key, index, element) {
	return {
		kind: "#schema",
		args: [
			"LSET",
			key,
			String(index),
			String(element)
		]
	};
}

//#endregion
//#region src/commands/list/lrem.ts
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
function input$38(key, count, element) {
	return {
		kind: "#schema",
		args: [
			"LREM",
			key,
			String(count),
			String(element)
		]
	};
}

//#endregion
//#region src/commands/list/lpush.ts
function input$37(key, ...elements) {
	return {
		kind: "#schema",
		args: [
			"LPUSH",
			key,
			...elements.flat().map(String)
		]
	};
}

//#endregion
//#region src/commands/list/lpushx.ts
function input$36(key, ...elements) {
	return {
		kind: "#schema",
		args: [
			"LPUSHX",
			key,
			...elements.flat().map(String)
		]
	};
}

//#endregion
//#region src/commands/list/rpop.ts
function input$35(key, count) {
	if (count !== void 0) return {
		kind: "#schema",
		args: [
			"RPOP",
			key,
			String(count)
		]
	};
	return {
		kind: "#schema",
		args: ["RPOP", key]
	};
}

//#endregion
//#region src/commands/list/lrange.ts
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
function input$34(key, start, stop) {
	return {
		kind: "#schema",
		args: [
			"LRANGE",
			key,
			String(start),
			String(stop)
		]
	};
}

//#endregion
//#region src/commands/list/llen.ts
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
function input$33(key) {
	return {
		kind: "#schema",
		args: ["LLEN", key]
	};
}

//#endregion
//#region src/commands/list/linsert.ts
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
function input$32(key, element, options) {
	return {
		kind: "#schema",
		args: [
			"LINSERT",
			key,
			..."BEFORE" in options ? ["BEFORE", String(options.BEFORE)] : ["AFTER", String(options.AFTER)],
			String(element)
		]
	};
}

//#endregion
//#region src/commands/list/ltrim.ts
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
function input$31(key, start, stop) {
	return {
		kind: "#schema",
		args: [
			"LTRIM",
			key,
			String(start),
			String(stop)
		]
	};
}

//#endregion
//#region src/commands/list/lindex.ts
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
function input$30(key, index) {
	return {
		kind: "#schema",
		args: [
			"LINDEX",
			key,
			String(index)
		]
	};
}

//#endregion
//#region src/commands/stream/xlen.ts
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
function input$29(key) {
	return {
		kind: "#schema",
		args: ["XLEN", key]
	};
}

//#endregion
//#region src/commands/stream/xdel.ts
function input$28(key, ...ids) {
	return {
		kind: "#schema",
		args: [
			"XDEL",
			key,
			...ids.flat()
		]
	};
}

//#endregion
//#region src/commands/stream/xread.ts
function input$27(arg0, arg1, arg2) {
	let options;
	const stream_keys = [];
	const stream_ids = [];
	if (typeof arg0 === "string" && typeof arg1 === "string") {
		stream_keys.push(arg0);
		stream_ids.push(arg1);
		options = arg2;
	} else {
		for (const [key, id] of Object.entries(arg0)) {
			stream_keys.push(key);
			stream_ids.push(id);
		}
		if (typeof arg1 !== "string") options = arg1;
	}
	const args = ["XREAD"];
	if (options) {
		if (options.COUNT !== void 0) args.push("COUNT", String(options.COUNT));
		if (options.BLOCK !== void 0) args.push("BLOCK", String(options.BLOCK));
	}
	args.push("STREAMS", ...stream_keys, ...stream_ids);
	return {
		kind: "#schema",
		args,
		replyTransform(reply) {
			reply ??= [];
			const result = {};
			for (const key of stream_keys) result[key] = [];
			for (const [key, entries] of reply) for (const [id, data] of entries) result[key].push({
				id,
				data: stringBulkToObject(data)
			});
			if (typeof arg0 === "string") return result[arg0];
			return result;
		}
	};
}

//#endregion
//#region src/commands/stream/xadd.ts
function input$26(key, id, pairs, options) {
	const cmdArgs = ["XADD", key];
	if (options) {
		if (options.NOMKSTREAM) cmdArgs.push("NOMKSTREAM");
		if (options.trim) {
			cmdArgs.push(options.trim.strategy);
			if (options.trim.operator) cmdArgs.push(options.trim.operator);
			if (options.trim.threshold !== void 0) cmdArgs.push(String(options.trim.threshold));
			if (options.trim.LIMIT !== void 0) cmdArgs.push("LIMIT", String(options.trim.LIMIT));
		}
	}
	cmdArgs.push(String(id));
	for (const [field, value] of Object.entries(pairs)) {
		if (value === void 0) continue;
		cmdArgs.push(field, String(value));
	}
	return {
		kind: "#schema",
		args: cmdArgs
	};
}

//#endregion
//#region src/commands/stream/xtrim.ts
function input$25(key, strategy, threshold, options) {
	const args = [
		"XTRIM",
		key,
		strategy
	];
	if (options === null || options === void 0 ? void 0 : options.trimOperator) args.push(options.trimOperator);
	args.push(String(threshold));
	if ((options === null || options === void 0 ? void 0 : options.LIMIT) !== void 0) args.push("LIMIT", String(options.LIMIT));
	return {
		kind: "#schema",
		args
	};
}

//#endregion
//#region src/commands/sorted-set/zcard.ts
/**
* Returns the sorted set cardinality (number of elements) of the sorted set stored at key.
* - Available since: 1.2.0.
* - Time complexity: O(1).
* @param key Key holds a sorted set.
* @returns The cardinality (number of members) of the sorted set, or 0 if the key doesn't exist.
* @see {@link https://redis.io/commands/zcard}
*/
function input$24(key) {
	return {
		kind: "#schema",
		args: ["ZCARD", key]
	};
}

//#endregion
//#region src/commands/sorted-set/zrangebyscore.ts
function input$23(key, min, max, options) {
	const args = [
		"ZRANGEBYSCORE",
		key,
		String(min),
		String(max)
	];
	if (options) {
		if (options.WITHSCORES) args.push("WITHSCORES");
		if (options.LIMIT) args.push("LIMIT", String(options.LIMIT[0]), String(options.LIMIT[1]));
	}
	return {
		kind: "#schema",
		args,
		replyTransform(result) {
			if (options === null || options === void 0 ? void 0 : options.WITHSCORES) {
				const transformed_result = [];
				for (let index = 0; index < result.length; index += 2) transformed_result.push({
					member: result[index],
					score: Number(result[index + 1])
				});
				return transformed_result;
			}
			return result;
		}
	};
}

//#endregion
//#region src/commands/sorted-set/zscore.ts
/**
* Returns the score of member in the sorted set at key.
* - Available since: 1.0.0.
* - Time complexity: O(1).
* @param key Key holds a sorted set.
* @param member Member in the sorted set.
* @returns The score of the member (a double-precision floating point number), represented as a string, or `null` if member does not exist in the sorted set, or the key does not exist.
* @see {@link https://redis.io/commands/zscore}
*/
function input$22(key, member) {
	return {
		kind: "#schema",
		args: [
			"ZSCORE",
			key,
			String(member)
		],
		replyTransform(result) {
			return result ? Number.parseFloat(result) : null;
		}
	};
}

//#endregion
//#region src/commands/sorted-set/zcount.ts
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
function input$21(key, min, max) {
	return {
		kind: "#schema",
		args: [
			"ZCOUNT",
			key,
			String(min),
			String(max)
		]
	};
}

//#endregion
//#region src/commands/sorted-set/zadd.ts
function input$20(key, arg1, arg2, arg3) {
	const args = ["ZADD", key];
	const pairs = [];
	if (typeof arg1 === "number") pairs.push(String(arg1), arg2);
	else for (const [member, score] of Object.entries(arg1)) pairs.push(String(score), member);
	const options = typeof arg2 === "string" || typeof arg2 === "number" ? arg3 : arg2;
	if (options) {
		if (options.NX) args.push("NX");
		if (options.XX) args.push("XX");
		if (options.GT) args.push("GT");
		if (options.LT) args.push("LT");
		if (options.CH) args.push("CH");
		if (options.INCR) args.push("INCR");
	}
	args.push(...pairs);
	return {
		kind: "#schema",
		args,
		replyTransform(result) {
			if (typeof result === "string") return Number.parseFloat(result);
			return result;
		}
	};
}

//#endregion
//#region src/commands/sorted-set/zrank.ts
function input$19(key, member, options) {
	const args = [
		"ZRANK",
		key,
		String(member)
	];
	if (options === null || options === void 0 ? void 0 : options.WITHSCORE) args.push("WITHSCORE");
	return {
		kind: "#schema",
		args,
		replyTransform(result) {
			if (result === null) return null;
			if (options === null || options === void 0 ? void 0 : options.WITHSCORE) {
				const [rank, score] = result;
				return {
					rank,
					score: Number.parseFloat(score)
				};
			}
			return result;
		}
	};
}

//#endregion
//#region src/commands/sorted-set/zrem.ts
function input$18(key, arg1, ...args_rest) {
	const args = ["ZREM", key];
	if (typeof arg1 === "string" || typeof arg1 === "number") args.push(String(arg1), ...args_rest.map(String));
	else args.push(...[...arg1].map(String));
	return {
		kind: "#schema",
		args
	};
}

//#endregion
//#region src/commands/sorted-set/zrange.ts
function input$17(key, start, stop, options) {
	const args = [
		"ZRANGE",
		key,
		String(start),
		String(stop)
	];
	if (options) {
		if (options.BY) args.push(`BY${options.BY}`);
		if (options.REV) args.push("REV");
		if (options.LIMIT) args.push("LIMIT", String(options.LIMIT[0]), String(options.LIMIT[1]));
		if (options.WITHSCORES) args.push("WITHSCORES");
	}
	return {
		kind: "#schema",
		args,
		replyTransform(result) {
			if (options === null || options === void 0 ? void 0 : options.WITHSCORES) {
				const transformed_result = [];
				for (let index = 0; index < result.length; index += 2) transformed_result.push({
					member: result[index],
					score: Number(result[index + 1])
				});
				return transformed_result;
			}
			return result;
		}
	};
}

//#endregion
//#region src/commands/sorted-set/zinterstore.ts
function input$16(destination, arg1, options) {
	const args = ["ZINTERSTORE", destination];
	if (Array.isArray(arg1)) args.push(String(arg1.length), ...arg1.map(String));
	else {
		const entries = Object.entries(arg1);
		args.push(String(entries.length));
		const weights = [];
		for (const [key, weight] of entries) {
			args.push(key);
			weights.push(String(weight));
		}
		args.push("WEIGHTS", ...weights);
	}
	if (options === null || options === void 0 ? void 0 : options.AGGREGATE) args.push("AGGREGATE", options.AGGREGATE);
	return {
		kind: "#schema",
		args
	};
}

//#endregion
//#region src/commands/sorted-set/zrangebylex.ts
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
function input$15(key, min, max, options) {
	const args = [
		"ZRANGEBYLEX",
		key,
		min,
		max
	];
	if (options === null || options === void 0 ? void 0 : options.LIMIT) args.push("LIMIT", String(options.LIMIT[0]), String(options.LIMIT[1]));
	return {
		kind: "#schema",
		args
	};
}

//#endregion
//#region src/commands/hash/hvals.ts
/**
* Returns all values in the hash stored at key.
* - Available since: 2.0.0.
* - Time complexity: O(N) where N is the size of the hash.
* @param key The key of the hash.
* @returns A set of values in the hash, or an empty set when the key does not exist.
* @see {@link https://redis.io/commands/hvals}
*/
function input$14(key) {
	return {
		kind: "#schema",
		args: ["HVALS", key],
		replyTransform: replyTransform$1
	};
}

//#endregion
//#region src/commands/hash/hset.ts
function input$13(key, arg1, arg2) {
	const pairs = [];
	if (typeof arg1 === "string") pairs.push(arg1, String(arg2));
	else for (const [field, value] of Object.entries(arg1)) pairs.push(field, String(value));
	return {
		kind: "#schema",
		args: [
			"HSET",
			key,
			...pairs
		]
	};
}

//#endregion
//#region src/commands/hash/hincrbyfloat.ts
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
function input$12(key, field, increment) {
	return {
		kind: "#schema",
		args: [
			"HINCRBYFLOAT",
			key,
			String(field),
			String(increment)
		]
	};
}

//#endregion
//#region src/commands/hash/hgetall.ts
/**
* Returns all fields and values of the hash stored at key.
* - Available since: 2.0.0.
* - Time complexity: O(N) where N is the size of the hash.
* @param key -
* @returns A record of fields and their values stored in the hash.
* @see {@link https://redis.io/commands/hgetall}
*/
function input$11(key) {
	return {
		kind: "#schema",
		args: ["HGETALL", key],
		replyTransform: stringBulkToObject
	};
}

//#endregion
//#region src/commands/hash/hget.ts
/**
* Returns the value associated with field in the hash stored at key.
* - Available since: 2.0.0.
* - Time complexity: O(1)
* @param key -
* @param field -
* @returns The value associated with field in the hash stored at key or null.
* @see {@link https://redis.io/commands/hget}
*/
function input$10(key, field) {
	return {
		kind: "#schema",
		args: [
			"HGET",
			key,
			field
		]
	};
}

//#endregion
//#region src/commands/hash/hmset.ts
function input$9(key, arg1, arg2) {
	const pairs = [];
	if (typeof arg1 === "string") pairs.push(arg1, String(arg2));
	else for (const [field, value] of Object.entries(arg1)) pairs.push(field, String(value));
	return {
		kind: "#schema",
		args: [
			"HMSET",
			key,
			...pairs
		]
	};
}

//#endregion
//#region src/commands/hash/hmget.ts
function input$8(key, ...fields) {
	return {
		kind: "#schema",
		args: [
			"HMGET",
			key,
			...fields.flat()
		]
	};
}

//#endregion
//#region src/commands/hash/hlen.ts
/**
* Returns the number of fields contained in the hash stored at key.
*
* - Available since: 2.0.0.
* - Time complexity: O(1).
* @param key Key to get hash length.
* @returns The number of fields in the hash, or 0 when the key does not exist.
* @see {@link https://redis.io/commands/hlen}
*/
function input$7(key) {
	return {
		kind: "#schema",
		args: ["HLEN", key]
	};
}

//#endregion
//#region src/commands/hash/hkeys.ts
/**
* Returns all field names in the hash stored at key.
*
* - Available since: 2.0.0.
* - Time complexity: O(N) where N is the size of the hash.
* @param key The key of the hash.
* @returns A set of fields in the hash, or an empty set when the key does not exist.
* @see {@link https://redis.io/commands/hkeys}
*/
function input$6(key) {
	return {
		kind: "#schema",
		args: ["HKEYS", key],
		replyTransform: replyTransform$1
	};
}

//#endregion
//#region src/commands/hash/hincrby.ts
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
function input$5(key, field, increment) {
	return {
		kind: "#schema",
		args: [
			"HINCRBY",
			key,
			String(field),
			String(increment)
		]
	};
}

//#endregion
//#region src/commands/hash/hdel.ts
function input$4(key, ...fields) {
	return {
		kind: "#schema",
		args: [
			"HDEL",
			key,
			...fields.flat().map(String)
		]
	};
}

//#endregion
//#region src/commands/hash/hstrlen.ts
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
function input$3(key, field) {
	return {
		kind: "#schema",
		args: [
			"HSTRLEN",
			key,
			field
		]
	};
}

//#endregion
//#region src/commands/hash/hexists.ts
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
function input$2(key, field) {
	return {
		kind: "#schema",
		args: [
			"HEXISTS",
			key,
			String(field)
		],
		replyTransform
	};
}

//#endregion
//#region src/commands/hash/hsetnx.ts
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
function input$1(key, field, value) {
	return {
		kind: "#schema",
		args: [
			"HSETNX",
			key,
			field,
			String(value)
		],
		replyTransform
	};
}

//#endregion
//#region src/commands/scripting/eval.ts
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
function input(script, keys, args) {
	const command_args = [
		"EVAL",
		script,
		String(keys.length),
		...keys.map(String)
	];
	if (args) command_args.push(...args.map(String));
	return {
		kind: "#schema",
		args: command_args
	};
}

//#endregion
//#region src/transaction/use.ts
var RedisXTransactionUse = class {
	queue = [];
	constructor(transaction) {
		this.transaction = transaction;
	}
	addCommand(command, ...args) {
		return this.useCommand({
			kind: "#schema",
			args: [command, ...args.map(String)]
		});
	}
	useCommand(command) {
		const redis_transaction_command = new RedisXTransactionCommand(-1);
		this.queue.push({
			command,
			redis_transaction_command
		});
		return redis_transaction_command;
	}
	SREM(key, ...members) {
		return this.useCommand(input$86(key, ...members));
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
	SMISMEMBER(key, ...members) {
		return this.useCommand(input$85(key, ...members));
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
	SMEMBERS(key) {
		return this.useCommand(input$84(key));
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
	SISMEMBER(key, member) {
		return this.useCommand(input$83(key, member));
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
	SCARD(key) {
		return this.useCommand(input$82(key));
	}
	SADD(key, ...members) {
		return this.useCommand(input$81(key, ...members));
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
	MSETNX(pairs) {
		return this.useCommand(input$80(pairs));
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
	SETNX(key, value) {
		return this.useCommand(input$79(key, value));
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
	GET(key) {
		return this.useCommand(input$78(key));
	}
	SET(key, value, options) {
		return this.useCommand(input$77(key, value, options));
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
	APPEND(key, value) {
		return this.useCommand(input$76(key, value));
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
	INCR(key) {
		return this.useCommand(input$75(key));
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
	INCRBYFLOAT(key, increment) {
		return this.useCommand(input$74(key, increment));
	}
	MGET(...args) {
		return this.useCommand(input$73(...args));
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
	GETDEL(key) {
		return this.useCommand(input$72(key));
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
	MSET(pairs) {
		return this.useCommand(input$71(pairs));
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
	INCRBY(key, increment) {
		return this.useCommand(input$70(key, increment));
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
	SETRANGE(key, offset, value) {
		return this.useCommand(input$69(key, offset, value));
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
	SUBSTR(key, start, end) {
		return this.useCommand(input$68(key, start, end));
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
	GETSET(key, value) {
		return this.useCommand(input$67(key, value));
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
	DECRBY(key, decrement) {
		return this.useCommand(input$66(key, decrement));
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
	GETRANGE(key, start, end) {
		return this.useCommand(input$65(key, start, end));
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
	SETEX(key, seconds, value) {
		return this.useCommand(input$64(key, seconds, value));
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
	GETEX(key, options) {
		return this.useCommand(input$63(key, options));
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
	STRLEN(key) {
		return this.useCommand(input$62(key));
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
	DECR(key) {
		return this.useCommand(input$61(key));
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
	PSETEX(key, milliseconds, value) {
		return this.useCommand(input$60(key, milliseconds, value));
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
	PEXPIRE(key, seconds, options) {
		return this.useCommand(input$59(key, seconds, options));
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
	PTTL(key) {
		return this.useCommand(input$58(key));
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
	TTL(key) {
		return this.useCommand(input$57(key));
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
	EXPIRE(key, seconds, options) {
		return this.useCommand(input$56(key, seconds, options));
	}
	/**
	* Returns the string representation of the type of the value stored at `key`.
	* - Available since: 1.0.0.
	* - Time complexity: O(1).
	* @param key The key to check.
	* @returns "OK".
	* @see {@link https://redis.io/commands/rename}
	*/
	TYPE(key) {
		return this.useCommand(input$55(key));
	}
	/**
	* Returns all keys matching pattern.
	* - Available since: 1.0.0.
	* - Time complexity: O(N) with N being the number of keys in the database.
	* @param pattern Pattern to match.
	* @returns A set of keys matching pattern.
	* @see {@link https://redis.io/commands/keys}
	*/
	KEYS(pattern) {
		return this.useCommand(input$54(pattern));
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
	COPY(source, destination, options) {
		return this.useCommand(input$53(source, destination, options));
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
	EXPIREAT(key, timestamp, options) {
		return this.useCommand(input$52(key, timestamp, options));
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
	PEXPIREAT(key, timestamp, options) {
		return this.useCommand(input$51(key, timestamp, options));
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
	PERSIST(key) {
		return this.useCommand(input$50(key));
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
	EXPIRETIME(key) {
		return this.useCommand(input$49(key));
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
	RENAME(key, newkey) {
		return this.useCommand(input$48(key, newkey));
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
	RENAMENX(key, newkey) {
		return this.useCommand(input$47(key, newkey));
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
	PEXPIRETIME(key) {
		return this.useCommand(input$46(key));
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
	DEL(...keys) {
		return this.useCommand(input$45(...keys));
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
	EXISTS(...keys) {
		return this.useCommand(input$44(...keys));
	}
	RPUSH(key, ...elements) {
		return this.useCommand(input$43(key, ...elements));
	}
	LPOP(key, count) {
		return this.useCommand(input$42(key, count));
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
	RPOPLPUSH(source, destination) {
		return this.useCommand(input$41(source, destination));
	}
	RPUSHX(key, ...elements) {
		return this.useCommand(input$40(key, ...elements));
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
	LSET(key, index, element) {
		return this.useCommand(input$39(key, index, element));
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
	LREM(key, count, element) {
		return this.useCommand(input$38(key, count, element));
	}
	LPUSH(key, ...elements) {
		return this.useCommand(input$37(key, ...elements));
	}
	LPUSHX(key, ...elements) {
		return this.useCommand(input$36(key, ...elements));
	}
	RPOP(key, count) {
		return this.useCommand(input$35(key, count));
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
	LRANGE(key, start, stop) {
		return this.useCommand(input$34(key, start, stop));
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
	LLEN(key) {
		return this.useCommand(input$33(key));
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
	LINSERT(key, element, options) {
		return this.useCommand(input$32(key, element, options));
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
	LTRIM(key, start, stop) {
		return this.useCommand(input$31(key, start, stop));
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
	LINDEX(key, index) {
		return this.useCommand(input$30(key, index));
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
	XLEN(key) {
		return this.useCommand(input$29(key));
	}
	XDEL(key, ...ids) {
		return this.useCommand(input$28(key, ...ids));
	}
	XREAD(arg0, arg1, arg2) {
		return this.useCommand(input$27(arg0, arg1, arg2));
	}
	XADD(key, id, pairs, options) {
		return this.useCommand(input$26(key, id, pairs, options));
	}
	XTRIM(key, strategy, threshold, options) {
		return this.useCommand(input$25(key, strategy, threshold, options));
	}
	/**
	* Returns the sorted set cardinality (number of elements) of the sorted set stored at key.
	* - Available since: 1.2.0.
	* - Time complexity: O(1).
	* @param key Key holds a sorted set.
	* @returns The cardinality (number of members) of the sorted set, or 0 if the key doesn't exist.
	* @see {@link https://redis.io/commands/zcard}
	*/
	ZCARD(key) {
		return this.useCommand(input$24(key));
	}
	ZRANGEBYSCORE(key, min, max, options) {
		return this.useCommand(input$23(key, min, max, options));
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
	ZSCORE(key, member) {
		return this.useCommand(input$22(key, member));
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
	ZCOUNT(key, min, max) {
		return this.useCommand(input$21(key, min, max));
	}
	ZADD(key, arg1, arg2, arg3) {
		return this.useCommand(input$20(key, arg1, arg2, arg3));
	}
	ZRANK(key, member, options) {
		return this.useCommand(input$19(key, member, options));
	}
	ZREM(key, arg1, ...args_rest) {
		return this.useCommand(input$18(key, arg1, ...args_rest));
	}
	ZRANGE(key, start, stop, options) {
		return this.useCommand(input$17(key, start, stop, options));
	}
	ZINTERSTORE(destination, arg1, options) {
		return this.useCommand(input$16(destination, arg1, options));
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
	ZRANGEBYLEX(key, min, max, options) {
		return this.useCommand(input$15(key, min, max, options));
	}
	/**
	* Returns all values in the hash stored at key.
	* - Available since: 2.0.0.
	* - Time complexity: O(N) where N is the size of the hash.
	* @param key The key of the hash.
	* @returns A set of values in the hash, or an empty set when the key does not exist.
	* @see {@link https://redis.io/commands/hvals}
	*/
	HVALS(key) {
		return this.useCommand(input$14(key));
	}
	HSET(key, arg1, arg2) {
		return this.useCommand(input$13(key, arg1, arg2));
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
	HINCRBYFLOAT(key, field, increment) {
		return this.useCommand(input$12(key, field, increment));
	}
	/**
	* Returns all fields and values of the hash stored at key.
	* - Available since: 2.0.0.
	* - Time complexity: O(N) where N is the size of the hash.
	* @param key -
	* @returns A record of fields and their values stored in the hash.
	* @see {@link https://redis.io/commands/hgetall}
	*/
	HGETALL(key) {
		return this.useCommand(input$11(key));
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
	HGET(key, field) {
		return this.useCommand(input$10(key, field));
	}
	HMSET(key, arg1, arg2) {
		return this.useCommand(input$9(key, arg1, arg2));
	}
	HMGET(key, ...fields) {
		return this.useCommand(input$8(key, ...fields));
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
	HLEN(key) {
		return this.useCommand(input$7(key));
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
	HKEYS(key) {
		return this.useCommand(input$6(key));
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
	HINCRBY(key, field, increment) {
		return this.useCommand(input$5(key, field, increment));
	}
	HDEL(key, ...fields) {
		return this.useCommand(input$4(key, ...fields));
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
	HSTRLEN(key, field) {
		return this.useCommand(input$3(key, field));
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
	HEXISTS(key, field) {
		return this.useCommand(input$2(key, field));
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
	HSETNX(key, field, value) {
		return this.useCommand(input$1(key, field, value));
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
	EVAL(script, keys, args) {
		return this.useCommand(input(script, keys, args));
	}
};

//#endregion
//#region src/transaction.ts
var RedisXTransaction = class {
	promise = Promise.resolve();
	queue_length = 0;
	transformers = [];
	return_no_array = false;
	data = {};
	constructor(redisClient) {
		this.multi = redisClient.MULTI();
	}
	addCommand(command, ...args) {
		this.promise = this.promise.then(() => {
			this.multi.addCommand([command, ...args.map(String)]);
			this.queue_length++;
		});
		return this;
	}
	/**
	* Addes command to MULTI queue.
	* @param command -
	*/
	queueCommand(command) {
		this.multi.addCommand(command.args);
		this.queue_length++;
		if (command.replyTransform) this.transformers[this.queue_length - 1] = command.replyTransform;
	}
	useCommand(command) {
		this.promise = this.promise.then(() => {
			this.queueCommand(command);
		});
		return this;
	}
	as(key) {
		this.promise = this.promise.then(() => {
			this.data[key] = new RedisXTransactionCommand(this.queue_length - 1);
		});
		return this;
	}
	use(callback) {
		this.return_no_array = true;
		this.promise = this.promise.then(async () => {
			const transaction_use = new RedisXTransactionUse(this);
			const result = await callback(transaction_use);
			for (const { command, redis_transaction_command } of transaction_use.queue) {
				this.queueCommand(command);
				redis_transaction_command.index = this.queue_length - 1;
			}
			Object.assign(this.data, result);
		});
		return this;
	}
	async execute() {
		await this.promise;
		const result = await this.multi.exec();
		for (const [index, transformer] of this.transformers.entries()) if (transformer) result[index] = transformer(result[index]);
		const result_named = unwrapRedisTransactionCommand(this.data, result);
		if (this.return_no_array) return result_named;
		return Object.assign(result, result_named);
	}
	SREM(key, ...members) {
		return this.useCommand(input$86(key, ...members));
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
	SMISMEMBER(key, ...members) {
		return this.useCommand(input$85(key, ...members));
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
	SMEMBERS(key) {
		return this.useCommand(input$84(key));
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
	SISMEMBER(key, member) {
		return this.useCommand(input$83(key, member));
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
	SCARD(key) {
		return this.useCommand(input$82(key));
	}
	SADD(key, ...members) {
		return this.useCommand(input$81(key, ...members));
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
	MSETNX(pairs) {
		return this.useCommand(input$80(pairs));
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
	SETNX(key, value) {
		return this.useCommand(input$79(key, value));
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
	GET(key) {
		return this.useCommand(input$78(key));
	}
	SET(key, value, options) {
		return this.useCommand(input$77(key, value, options));
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
	APPEND(key, value) {
		return this.useCommand(input$76(key, value));
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
	INCR(key) {
		return this.useCommand(input$75(key));
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
	INCRBYFLOAT(key, increment) {
		return this.useCommand(input$74(key, increment));
	}
	MGET(...args) {
		return this.useCommand(input$73(...args));
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
	GETDEL(key) {
		return this.useCommand(input$72(key));
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
	MSET(pairs) {
		return this.useCommand(input$71(pairs));
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
	INCRBY(key, increment) {
		return this.useCommand(input$70(key, increment));
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
	SETRANGE(key, offset, value) {
		return this.useCommand(input$69(key, offset, value));
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
	SUBSTR(key, start, end) {
		return this.useCommand(input$68(key, start, end));
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
	GETSET(key, value) {
		return this.useCommand(input$67(key, value));
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
	DECRBY(key, decrement) {
		return this.useCommand(input$66(key, decrement));
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
	GETRANGE(key, start, end) {
		return this.useCommand(input$65(key, start, end));
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
	SETEX(key, seconds, value) {
		return this.useCommand(input$64(key, seconds, value));
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
	GETEX(key, options) {
		return this.useCommand(input$63(key, options));
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
	STRLEN(key) {
		return this.useCommand(input$62(key));
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
	DECR(key) {
		return this.useCommand(input$61(key));
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
	PSETEX(key, milliseconds, value) {
		return this.useCommand(input$60(key, milliseconds, value));
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
	PEXPIRE(key, seconds, options) {
		return this.useCommand(input$59(key, seconds, options));
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
	PTTL(key) {
		return this.useCommand(input$58(key));
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
	TTL(key) {
		return this.useCommand(input$57(key));
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
	EXPIRE(key, seconds, options) {
		return this.useCommand(input$56(key, seconds, options));
	}
	/**
	* Returns the string representation of the type of the value stored at `key`.
	* - Available since: 1.0.0.
	* - Time complexity: O(1).
	* @param key The key to check.
	* @returns "OK".
	* @see {@link https://redis.io/commands/rename}
	*/
	TYPE(key) {
		return this.useCommand(input$55(key));
	}
	/**
	* Returns all keys matching pattern.
	* - Available since: 1.0.0.
	* - Time complexity: O(N) with N being the number of keys in the database.
	* @param pattern Pattern to match.
	* @returns A set of keys matching pattern.
	* @see {@link https://redis.io/commands/keys}
	*/
	KEYS(pattern) {
		return this.useCommand(input$54(pattern));
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
	COPY(source, destination, options) {
		return this.useCommand(input$53(source, destination, options));
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
	EXPIREAT(key, timestamp, options) {
		return this.useCommand(input$52(key, timestamp, options));
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
	PEXPIREAT(key, timestamp, options) {
		return this.useCommand(input$51(key, timestamp, options));
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
	PERSIST(key) {
		return this.useCommand(input$50(key));
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
	EXPIRETIME(key) {
		return this.useCommand(input$49(key));
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
	RENAME(key, newkey) {
		return this.useCommand(input$48(key, newkey));
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
	RENAMENX(key, newkey) {
		return this.useCommand(input$47(key, newkey));
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
	PEXPIRETIME(key) {
		return this.useCommand(input$46(key));
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
	DEL(...keys) {
		return this.useCommand(input$45(...keys));
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
	EXISTS(...keys) {
		return this.useCommand(input$44(...keys));
	}
	RPUSH(key, ...elements) {
		return this.useCommand(input$43(key, ...elements));
	}
	LPOP(key, count) {
		return this.useCommand(input$42(key, count));
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
	RPOPLPUSH(source, destination) {
		return this.useCommand(input$41(source, destination));
	}
	RPUSHX(key, ...elements) {
		return this.useCommand(input$40(key, ...elements));
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
	LSET(key, index, element) {
		return this.useCommand(input$39(key, index, element));
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
	LREM(key, count, element) {
		return this.useCommand(input$38(key, count, element));
	}
	LPUSH(key, ...elements) {
		return this.useCommand(input$37(key, ...elements));
	}
	LPUSHX(key, ...elements) {
		return this.useCommand(input$36(key, ...elements));
	}
	RPOP(key, count) {
		return this.useCommand(input$35(key, count));
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
	LRANGE(key, start, stop) {
		return this.useCommand(input$34(key, start, stop));
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
	LLEN(key) {
		return this.useCommand(input$33(key));
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
	LINSERT(key, element, options) {
		return this.useCommand(input$32(key, element, options));
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
	LTRIM(key, start, stop) {
		return this.useCommand(input$31(key, start, stop));
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
	LINDEX(key, index) {
		return this.useCommand(input$30(key, index));
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
	XLEN(key) {
		return this.useCommand(input$29(key));
	}
	XDEL(key, ...ids) {
		return this.useCommand(input$28(key, ...ids));
	}
	XREAD(arg0, arg1, arg2) {
		return this.useCommand(input$27(arg0, arg1, arg2));
	}
	XADD(key, id, pairs, options) {
		return this.useCommand(input$26(key, id, pairs, options));
	}
	XTRIM(key, strategy, threshold, options) {
		return this.useCommand(input$25(key, strategy, threshold, options));
	}
	/**
	* Returns the sorted set cardinality (number of elements) of the sorted set stored at key.
	* - Available since: 1.2.0.
	* - Time complexity: O(1).
	* @param key Key holds a sorted set.
	* @returns The cardinality (number of members) of the sorted set, or 0 if the key doesn't exist.
	* @see {@link https://redis.io/commands/zcard}
	*/
	ZCARD(key) {
		return this.useCommand(input$24(key));
	}
	ZRANGEBYSCORE(key, min, max, options) {
		return this.useCommand(input$23(key, min, max, options));
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
	ZSCORE(key, member) {
		return this.useCommand(input$22(key, member));
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
	ZCOUNT(key, min, max) {
		return this.useCommand(input$21(key, min, max));
	}
	ZADD(key, arg1, arg2, arg3) {
		return this.useCommand(input$20(key, arg1, arg2, arg3));
	}
	ZRANK(key, member, options) {
		return this.useCommand(input$19(key, member, options));
	}
	ZREM(key, arg1, ...args_rest) {
		return this.useCommand(input$18(key, arg1, ...args_rest));
	}
	ZRANGE(key, start, stop, options) {
		return this.useCommand(input$17(key, start, stop, options));
	}
	ZINTERSTORE(destination, arg1, options) {
		return this.useCommand(input$16(destination, arg1, options));
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
	ZRANGEBYLEX(key, min, max, options) {
		return this.useCommand(input$15(key, min, max, options));
	}
	/**
	* Returns all values in the hash stored at key.
	* - Available since: 2.0.0.
	* - Time complexity: O(N) where N is the size of the hash.
	* @param key The key of the hash.
	* @returns A set of values in the hash, or an empty set when the key does not exist.
	* @see {@link https://redis.io/commands/hvals}
	*/
	HVALS(key) {
		return this.useCommand(input$14(key));
	}
	HSET(key, arg1, arg2) {
		return this.useCommand(input$13(key, arg1, arg2));
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
	HINCRBYFLOAT(key, field, increment) {
		return this.useCommand(input$12(key, field, increment));
	}
	/**
	* Returns all fields and values of the hash stored at key.
	* - Available since: 2.0.0.
	* - Time complexity: O(N) where N is the size of the hash.
	* @param key -
	* @returns A record of fields and their values stored in the hash.
	* @see {@link https://redis.io/commands/hgetall}
	*/
	HGETALL(key) {
		return this.useCommand(input$11(key));
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
	HGET(key, field) {
		return this.useCommand(input$10(key, field));
	}
	HMSET(key, arg1, arg2) {
		return this.useCommand(input$9(key, arg1, arg2));
	}
	HMGET(key, ...fields) {
		return this.useCommand(input$8(key, ...fields));
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
	HLEN(key) {
		return this.useCommand(input$7(key));
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
	HKEYS(key) {
		return this.useCommand(input$6(key));
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
	HINCRBY(key, field, increment) {
		return this.useCommand(input$5(key, field, increment));
	}
	HDEL(key, ...fields) {
		return this.useCommand(input$4(key, ...fields));
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
	HSTRLEN(key, field) {
		return this.useCommand(input$3(key, field));
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
	HEXISTS(key, field) {
		return this.useCommand(input$2(key, field));
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
	HSETNX(key, field, value) {
		return this.useCommand(input$1(key, field, value));
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
	EVAL(script, keys, args) {
		return this.useCommand(input(script, keys, args));
	}
};

//#endregion
//#region src/client.ts
var RedisXClient = class {
	constructor(redisClient) {
		this.redisClient = redisClient;
	}
	async sendCommand(command, ...args) {
		return await this.redisClient.sendCommand([command, ...args.map(String)]);
	}
	async useCommand(command) {
		const result = await this.redisClient.sendCommand(command.args);
		if (command.replyTransform) return command.replyTransform(result);
		return result;
	}
	createTransaction() {
		return new RedisXTransaction(this.redisClient);
	}
	SREM(key, ...members) {
		return this.useCommand(input$86(key, ...members));
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
	SMISMEMBER(key, ...members) {
		return this.useCommand(input$85(key, ...members));
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
	SMEMBERS(key) {
		return this.useCommand(input$84(key));
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
	SISMEMBER(key, member) {
		return this.useCommand(input$83(key, member));
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
	SCARD(key) {
		return this.useCommand(input$82(key));
	}
	SADD(key, ...members) {
		return this.useCommand(input$81(key, ...members));
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
	MSETNX(pairs) {
		return this.useCommand(input$80(pairs));
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
	SETNX(key, value) {
		return this.useCommand(input$79(key, value));
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
	GET(key) {
		return this.useCommand(input$78(key));
	}
	SET(key, value, options) {
		return this.useCommand(input$77(key, value, options));
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
	APPEND(key, value) {
		return this.useCommand(input$76(key, value));
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
	INCR(key) {
		return this.useCommand(input$75(key));
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
	INCRBYFLOAT(key, increment) {
		return this.useCommand(input$74(key, increment));
	}
	MGET(...args) {
		return this.useCommand(input$73(...args));
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
	GETDEL(key) {
		return this.useCommand(input$72(key));
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
	MSET(pairs) {
		return this.useCommand(input$71(pairs));
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
	INCRBY(key, increment) {
		return this.useCommand(input$70(key, increment));
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
	SETRANGE(key, offset, value) {
		return this.useCommand(input$69(key, offset, value));
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
	SUBSTR(key, start, end) {
		return this.useCommand(input$68(key, start, end));
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
	GETSET(key, value) {
		return this.useCommand(input$67(key, value));
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
	DECRBY(key, decrement) {
		return this.useCommand(input$66(key, decrement));
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
	GETRANGE(key, start, end) {
		return this.useCommand(input$65(key, start, end));
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
	SETEX(key, seconds, value) {
		return this.useCommand(input$64(key, seconds, value));
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
	GETEX(key, options) {
		return this.useCommand(input$63(key, options));
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
	STRLEN(key) {
		return this.useCommand(input$62(key));
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
	DECR(key) {
		return this.useCommand(input$61(key));
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
	PSETEX(key, milliseconds, value) {
		return this.useCommand(input$60(key, milliseconds, value));
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
	PEXPIRE(key, seconds, options) {
		return this.useCommand(input$59(key, seconds, options));
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
	PTTL(key) {
		return this.useCommand(input$58(key));
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
	TTL(key) {
		return this.useCommand(input$57(key));
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
	EXPIRE(key, seconds, options) {
		return this.useCommand(input$56(key, seconds, options));
	}
	/**
	* Returns the string representation of the type of the value stored at `key`.
	* - Available since: 1.0.0.
	* - Time complexity: O(1).
	* @param key The key to check.
	* @returns "OK".
	* @see {@link https://redis.io/commands/rename}
	*/
	TYPE(key) {
		return this.useCommand(input$55(key));
	}
	/**
	* Returns all keys matching pattern.
	* - Available since: 1.0.0.
	* - Time complexity: O(N) with N being the number of keys in the database.
	* @param pattern Pattern to match.
	* @returns A set of keys matching pattern.
	* @see {@link https://redis.io/commands/keys}
	*/
	KEYS(pattern) {
		return this.useCommand(input$54(pattern));
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
	COPY(source, destination, options) {
		return this.useCommand(input$53(source, destination, options));
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
	EXPIREAT(key, timestamp, options) {
		return this.useCommand(input$52(key, timestamp, options));
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
	PEXPIREAT(key, timestamp, options) {
		return this.useCommand(input$51(key, timestamp, options));
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
	PERSIST(key) {
		return this.useCommand(input$50(key));
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
	EXPIRETIME(key) {
		return this.useCommand(input$49(key));
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
	RENAME(key, newkey) {
		return this.useCommand(input$48(key, newkey));
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
	RENAMENX(key, newkey) {
		return this.useCommand(input$47(key, newkey));
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
	PEXPIRETIME(key) {
		return this.useCommand(input$46(key));
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
	DEL(...keys) {
		return this.useCommand(input$45(...keys));
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
	EXISTS(...keys) {
		return this.useCommand(input$44(...keys));
	}
	RPUSH(key, ...elements) {
		return this.useCommand(input$43(key, ...elements));
	}
	LPOP(key, count) {
		return this.useCommand(input$42(key, count));
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
	RPOPLPUSH(source, destination) {
		return this.useCommand(input$41(source, destination));
	}
	RPUSHX(key, ...elements) {
		return this.useCommand(input$40(key, ...elements));
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
	LSET(key, index, element) {
		return this.useCommand(input$39(key, index, element));
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
	LREM(key, count, element) {
		return this.useCommand(input$38(key, count, element));
	}
	LPUSH(key, ...elements) {
		return this.useCommand(input$37(key, ...elements));
	}
	LPUSHX(key, ...elements) {
		return this.useCommand(input$36(key, ...elements));
	}
	RPOP(key, count) {
		return this.useCommand(input$35(key, count));
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
	LRANGE(key, start, stop) {
		return this.useCommand(input$34(key, start, stop));
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
	LLEN(key) {
		return this.useCommand(input$33(key));
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
	LINSERT(key, element, options) {
		return this.useCommand(input$32(key, element, options));
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
	LTRIM(key, start, stop) {
		return this.useCommand(input$31(key, start, stop));
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
	LINDEX(key, index) {
		return this.useCommand(input$30(key, index));
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
	XLEN(key) {
		return this.useCommand(input$29(key));
	}
	XDEL(key, ...ids) {
		return this.useCommand(input$28(key, ...ids));
	}
	XREAD(arg0, arg1, arg2) {
		return this.useCommand(input$27(arg0, arg1, arg2));
	}
	XADD(key, id, pairs, options) {
		return this.useCommand(input$26(key, id, pairs, options));
	}
	XTRIM(key, strategy, threshold, options) {
		return this.useCommand(input$25(key, strategy, threshold, options));
	}
	/**
	* Returns the sorted set cardinality (number of elements) of the sorted set stored at key.
	* - Available since: 1.2.0.
	* - Time complexity: O(1).
	* @param key Key holds a sorted set.
	* @returns The cardinality (number of members) of the sorted set, or 0 if the key doesn't exist.
	* @see {@link https://redis.io/commands/zcard}
	*/
	ZCARD(key) {
		return this.useCommand(input$24(key));
	}
	ZRANGEBYSCORE(key, min, max, options) {
		return this.useCommand(input$23(key, min, max, options));
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
	ZSCORE(key, member) {
		return this.useCommand(input$22(key, member));
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
	ZCOUNT(key, min, max) {
		return this.useCommand(input$21(key, min, max));
	}
	ZADD(key, arg1, arg2, arg3) {
		return this.useCommand(input$20(key, arg1, arg2, arg3));
	}
	ZRANK(key, member, options) {
		return this.useCommand(input$19(key, member, options));
	}
	ZREM(key, arg1, ...args_rest) {
		return this.useCommand(input$18(key, arg1, ...args_rest));
	}
	ZRANGE(key, start, stop, options) {
		return this.useCommand(input$17(key, start, stop, options));
	}
	ZINTERSTORE(destination, arg1, options) {
		return this.useCommand(input$16(destination, arg1, options));
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
	ZRANGEBYLEX(key, min, max, options) {
		return this.useCommand(input$15(key, min, max, options));
	}
	/**
	* Returns all values in the hash stored at key.
	* - Available since: 2.0.0.
	* - Time complexity: O(N) where N is the size of the hash.
	* @param key The key of the hash.
	* @returns A set of values in the hash, or an empty set when the key does not exist.
	* @see {@link https://redis.io/commands/hvals}
	*/
	HVALS(key) {
		return this.useCommand(input$14(key));
	}
	HSET(key, arg1, arg2) {
		return this.useCommand(input$13(key, arg1, arg2));
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
	HINCRBYFLOAT(key, field, increment) {
		return this.useCommand(input$12(key, field, increment));
	}
	/**
	* Returns all fields and values of the hash stored at key.
	* - Available since: 2.0.0.
	* - Time complexity: O(N) where N is the size of the hash.
	* @param key -
	* @returns A record of fields and their values stored in the hash.
	* @see {@link https://redis.io/commands/hgetall}
	*/
	HGETALL(key) {
		return this.useCommand(input$11(key));
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
	HGET(key, field) {
		return this.useCommand(input$10(key, field));
	}
	HMSET(key, arg1, arg2) {
		return this.useCommand(input$9(key, arg1, arg2));
	}
	HMGET(key, ...fields) {
		return this.useCommand(input$8(key, ...fields));
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
	HLEN(key) {
		return this.useCommand(input$7(key));
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
	HKEYS(key) {
		return this.useCommand(input$6(key));
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
	HINCRBY(key, field, increment) {
		return this.useCommand(input$5(key, field, increment));
	}
	HDEL(key, ...fields) {
		return this.useCommand(input$4(key, ...fields));
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
	HSTRLEN(key, field) {
		return this.useCommand(input$3(key, field));
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
	HEXISTS(key, field) {
		return this.useCommand(input$2(key, field));
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
	HSETNX(key, field, value) {
		return this.useCommand(input$1(key, field, value));
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
	EVAL(script, keys, args) {
		return this.useCommand(input(script, keys, args));
	}
};

//#endregion
export { RedisXClient };