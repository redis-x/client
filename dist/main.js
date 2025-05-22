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
function input$64(key, ...members) {
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
function input$63(key, ...members) {
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
function input$62(key) {
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
function input$61(key, member) {
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
function input$60(key) {
	return {
		kind: "#schema",
		args: ["SCARD", key]
	};
}

//#endregion
//#region src/commands/set/sadd.ts
function input$59(key, ...members) {
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
function input$58(pairs) {
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
function input$57(key, value) {
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
function input$56(key) {
	return {
		kind: "#schema",
		args: ["GET", key]
	};
}

//#endregion
//#region src/commands/string/set.ts
function input$55(key, value, options) {
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
function input$54(key, value) {
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
function input$53(key) {
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
function input$52(key, increment) {
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
function input$51(...args) {
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
function input$50(key) {
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
function input$49(pairs) {
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
function input$48(key, increment) {
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
function input$47(key, offset, value) {
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
function input$46(key, start, end) {
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
function input$45(key, value) {
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
function input$44(key, decrement) {
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
function input$43(key, start, end) {
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
function input$42(key, seconds, value) {
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
function input$41(key, options) {
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
function input$40(key) {
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
function input$39(key) {
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
function input$38(key, milliseconds, value) {
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
function input$37(key, seconds, options) {
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
function input$36(key) {
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
function input$35(key) {
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
function input$34(key, seconds, options) {
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
function input$33(key) {
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
function input$32(pattern) {
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
function input$31(source, destination, options) {
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
function input$30(key, timestamp, options) {
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
function input$29(key, timestamp, options) {
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
function input$28(key) {
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
function input$27(key) {
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
function input$26(key, newkey) {
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
function input$25(key, newkey) {
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
function input$24(key) {
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
function input$23(...keys) {
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
function input$22(...keys) {
	return {
		kind: "#schema",
		args: ["EXISTS", ...keys]
	};
}

//#endregion
//#region src/commands/list/lpush.ts
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
function input$21(key, ...elements) {
	return {
		kind: "#schema",
		args: [
			"LPUSH",
			key,
			...elements.map(String)
		]
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
function input$20(key) {
	return {
		kind: "#schema",
		args: ["ZCARD", key]
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
function input$19(key, member) {
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
//#region src/commands/sorted-set/zadd.ts
function input$18(key, arg1, arg2, arg3) {
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
//#region src/commands/sorted-set/zrem.ts
function input$17(key, arg1, ...args_rest) {
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
function input$16(key, start, stop, options) {
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
function input$15(destination, arg1, options) {
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
		return this.useCommand(input$64(key, ...members));
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
		return this.useCommand(input$63(key, ...members));
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
		return this.useCommand(input$62(key));
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
		return this.useCommand(input$61(key, member));
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
		return this.useCommand(input$60(key));
	}
	SADD(key, ...members) {
		return this.useCommand(input$59(key, ...members));
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
		return this.useCommand(input$58(pairs));
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
		return this.useCommand(input$57(key, value));
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
		return this.useCommand(input$56(key));
	}
	SET(key, value, options) {
		return this.useCommand(input$55(key, value, options));
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
		return this.useCommand(input$54(key, value));
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
		return this.useCommand(input$53(key));
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
		return this.useCommand(input$52(key, increment));
	}
	MGET(...args) {
		return this.useCommand(input$51(...args));
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
		return this.useCommand(input$50(key));
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
		return this.useCommand(input$49(pairs));
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
		return this.useCommand(input$48(key, increment));
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
		return this.useCommand(input$47(key, offset, value));
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
		return this.useCommand(input$46(key, start, end));
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
		return this.useCommand(input$45(key, value));
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
		return this.useCommand(input$44(key, decrement));
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
		return this.useCommand(input$43(key, start, end));
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
		return this.useCommand(input$42(key, seconds, value));
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
		return this.useCommand(input$41(key, options));
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
		return this.useCommand(input$40(key));
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
		return this.useCommand(input$39(key));
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
		return this.useCommand(input$38(key, milliseconds, value));
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
		return this.useCommand(input$37(key, seconds, options));
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
		return this.useCommand(input$36(key));
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
		return this.useCommand(input$35(key));
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
		return this.useCommand(input$34(key, seconds, options));
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
		return this.useCommand(input$33(key));
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
		return this.useCommand(input$32(pattern));
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
		return this.useCommand(input$31(source, destination, options));
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
		return this.useCommand(input$30(key, timestamp, options));
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
		return this.useCommand(input$29(key, timestamp, options));
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
		return this.useCommand(input$28(key));
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
		return this.useCommand(input$27(key));
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
		return this.useCommand(input$26(key, newkey));
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
		return this.useCommand(input$25(key, newkey));
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
		return this.useCommand(input$24(key));
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
		return this.useCommand(input$23(...keys));
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
		return this.useCommand(input$22(...keys));
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
	LPUSH(key, ...elements) {
		return this.useCommand(input$21(key, ...elements));
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
		return this.useCommand(input$20(key));
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
		return this.useCommand(input$19(key, member));
	}
	ZADD(key, arg1, arg2, arg3) {
		return this.useCommand(input$18(key, arg1, arg2, arg3));
	}
	ZREM(key, arg1, ...args_rest) {
		return this.useCommand(input$17(key, arg1, ...args_rest));
	}
	ZRANGE(key, start, stop, options) {
		return this.useCommand(input$16(key, start, stop, options));
	}
	ZINTERSTORE(destination, arg1, options) {
		return this.useCommand(input$15(destination, arg1, options));
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
		return this.useCommand(input$64(key, ...members));
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
		return this.useCommand(input$63(key, ...members));
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
		return this.useCommand(input$62(key));
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
		return this.useCommand(input$61(key, member));
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
		return this.useCommand(input$60(key));
	}
	SADD(key, ...members) {
		return this.useCommand(input$59(key, ...members));
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
		return this.useCommand(input$58(pairs));
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
		return this.useCommand(input$57(key, value));
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
		return this.useCommand(input$56(key));
	}
	SET(key, value, options) {
		return this.useCommand(input$55(key, value, options));
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
		return this.useCommand(input$54(key, value));
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
		return this.useCommand(input$53(key));
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
		return this.useCommand(input$52(key, increment));
	}
	MGET(...args) {
		return this.useCommand(input$51(...args));
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
		return this.useCommand(input$50(key));
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
		return this.useCommand(input$49(pairs));
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
		return this.useCommand(input$48(key, increment));
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
		return this.useCommand(input$47(key, offset, value));
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
		return this.useCommand(input$46(key, start, end));
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
		return this.useCommand(input$45(key, value));
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
		return this.useCommand(input$44(key, decrement));
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
		return this.useCommand(input$43(key, start, end));
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
		return this.useCommand(input$42(key, seconds, value));
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
		return this.useCommand(input$41(key, options));
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
		return this.useCommand(input$40(key));
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
		return this.useCommand(input$39(key));
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
		return this.useCommand(input$38(key, milliseconds, value));
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
		return this.useCommand(input$37(key, seconds, options));
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
		return this.useCommand(input$36(key));
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
		return this.useCommand(input$35(key));
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
		return this.useCommand(input$34(key, seconds, options));
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
		return this.useCommand(input$33(key));
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
		return this.useCommand(input$32(pattern));
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
		return this.useCommand(input$31(source, destination, options));
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
		return this.useCommand(input$30(key, timestamp, options));
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
		return this.useCommand(input$29(key, timestamp, options));
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
		return this.useCommand(input$28(key));
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
		return this.useCommand(input$27(key));
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
		return this.useCommand(input$26(key, newkey));
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
		return this.useCommand(input$25(key, newkey));
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
		return this.useCommand(input$24(key));
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
		return this.useCommand(input$23(...keys));
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
		return this.useCommand(input$22(...keys));
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
	LPUSH(key, ...elements) {
		return this.useCommand(input$21(key, ...elements));
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
		return this.useCommand(input$20(key));
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
		return this.useCommand(input$19(key, member));
	}
	ZADD(key, arg1, arg2, arg3) {
		return this.useCommand(input$18(key, arg1, arg2, arg3));
	}
	ZREM(key, arg1, ...args_rest) {
		return this.useCommand(input$17(key, arg1, ...args_rest));
	}
	ZRANGE(key, start, stop, options) {
		return this.useCommand(input$16(key, start, stop, options));
	}
	ZINTERSTORE(destination, arg1, options) {
		return this.useCommand(input$15(destination, arg1, options));
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
		return this.useCommand(input$64(key, ...members));
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
		return this.useCommand(input$63(key, ...members));
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
		return this.useCommand(input$62(key));
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
		return this.useCommand(input$61(key, member));
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
		return this.useCommand(input$60(key));
	}
	SADD(key, ...members) {
		return this.useCommand(input$59(key, ...members));
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
		return this.useCommand(input$58(pairs));
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
		return this.useCommand(input$57(key, value));
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
		return this.useCommand(input$56(key));
	}
	SET(key, value, options) {
		return this.useCommand(input$55(key, value, options));
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
		return this.useCommand(input$54(key, value));
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
		return this.useCommand(input$53(key));
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
		return this.useCommand(input$52(key, increment));
	}
	MGET(...args) {
		return this.useCommand(input$51(...args));
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
		return this.useCommand(input$50(key));
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
		return this.useCommand(input$49(pairs));
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
		return this.useCommand(input$48(key, increment));
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
		return this.useCommand(input$47(key, offset, value));
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
		return this.useCommand(input$46(key, start, end));
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
		return this.useCommand(input$45(key, value));
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
		return this.useCommand(input$44(key, decrement));
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
		return this.useCommand(input$43(key, start, end));
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
		return this.useCommand(input$42(key, seconds, value));
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
		return this.useCommand(input$41(key, options));
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
		return this.useCommand(input$40(key));
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
		return this.useCommand(input$39(key));
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
		return this.useCommand(input$38(key, milliseconds, value));
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
		return this.useCommand(input$37(key, seconds, options));
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
		return this.useCommand(input$36(key));
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
		return this.useCommand(input$35(key));
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
		return this.useCommand(input$34(key, seconds, options));
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
		return this.useCommand(input$33(key));
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
		return this.useCommand(input$32(pattern));
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
		return this.useCommand(input$31(source, destination, options));
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
		return this.useCommand(input$30(key, timestamp, options));
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
		return this.useCommand(input$29(key, timestamp, options));
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
		return this.useCommand(input$28(key));
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
		return this.useCommand(input$27(key));
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
		return this.useCommand(input$26(key, newkey));
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
		return this.useCommand(input$25(key, newkey));
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
		return this.useCommand(input$24(key));
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
		return this.useCommand(input$23(...keys));
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
		return this.useCommand(input$22(...keys));
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
	LPUSH(key, ...elements) {
		return this.useCommand(input$21(key, ...elements));
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
		return this.useCommand(input$20(key));
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
		return this.useCommand(input$19(key, member));
	}
	ZADD(key, arg1, arg2, arg3) {
		return this.useCommand(input$18(key, arg1, arg2, arg3));
	}
	ZREM(key, arg1, ...args_rest) {
		return this.useCommand(input$17(key, arg1, ...args_rest));
	}
	ZRANGE(key, start, stop, options) {
		return this.useCommand(input$16(key, start, stop, options));
	}
	ZINTERSTORE(destination, arg1, options) {
		return this.useCommand(input$15(destination, arg1, options));
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