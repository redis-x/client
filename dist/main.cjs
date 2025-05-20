"use strict";

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
function input$27(key) {
	return {
		kind: "#schema",
		args: ["GET", key]
	};
}

//#endregion
//#region src/commands/string/set.ts
function input$26(key, value, options) {
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
function input$25(key, seconds, options) {
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
		replyTransform: replyTransform$6
	};
}
function replyTransform$6(reply) {
	return reply === 1;
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
function input$24(key) {
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
function input$23(key) {
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
function input$22(key, seconds, options) {
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
		replyTransform: replyTransform$5
	};
}
function replyTransform$5(reply) {
	return reply === 1;
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
function input$21(key) {
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
function input$20(pattern) {
	return {
		kind: "#schema",
		args: ["KEYS", pattern],
		replyTransform: replyTransform$4
	};
}
function replyTransform$4(reply) {
	return new Set(reply);
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
function input$19(source, destination, options) {
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
		replyTransform: replyTransform$3
	};
}
function replyTransform$3(reply) {
	return reply === 1;
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
function input$18(key, timestamp, options) {
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
		replyTransform: replyTransform$2
	};
}
function replyTransform$2(reply) {
	return reply === 1;
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
function input$17(key, timestamp, options) {
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
		replyTransform: replyTransform$1
	};
}
function replyTransform$1(reply) {
	return reply === 1;
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
function input$16(key) {
	return {
		kind: "#schema",
		args: ["PERSIST", key],
		replyTransform
	};
}
function replyTransform(reply) {
	return reply === 1;
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
function input$15(key) {
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
function input$14(key, newkey) {
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
function input$13(key, newkey) {
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
function input$12(key) {
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
function input$11(...keys) {
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
function input$10(...keys) {
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
function input$9(key, ...elements) {
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
function input$8(key) {
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
function input$7(key, member) {
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
function input$6(key, arg1, arg2, arg3) {
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
function input$5(key, arg1, ...args_rest) {
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
function input$4(key, start, stop, options) {
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
function input$3(destination, arg1, options) {
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
//#region src/commands/hash/hset.ts
function input$2(key, arg1, arg2) {
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
//#region src/commands/hash/hgetall.ts
/**
* Returns all fields and values of the hash stored at key.
* - Available since: 2.0.0.
* - Time complexity: O(N) where N is the size of the hash.
* @param key -
* @returns A record of fields and their values stored in the hash.
* @see {@link https://redis.io/commands/hgetall}
*/
function input$1(key) {
	return {
		kind: "#schema",
		args: ["HGETALL", key],
		replyTransform: stringBulkToObject
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
		return this.useCommand(input$27(key));
	}
	SET(key, value, options) {
		return this.useCommand(input$26(key, value, options));
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
		return this.useCommand(input$25(key, seconds, options));
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
		return this.useCommand(input$24(key));
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
		return this.useCommand(input$23(key));
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
		return this.useCommand(input$22(key, seconds, options));
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
		return this.useCommand(input$21(key));
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
		return this.useCommand(input$20(pattern));
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
		return this.useCommand(input$19(source, destination, options));
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
		return this.useCommand(input$18(key, timestamp, options));
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
		return this.useCommand(input$17(key, timestamp, options));
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
		return this.useCommand(input$16(key));
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
		return this.useCommand(input$15(key));
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
		return this.useCommand(input$14(key, newkey));
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
		return this.useCommand(input$13(key, newkey));
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
		return this.useCommand(input$12(key));
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
		return this.useCommand(input$11(...keys));
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
		return this.useCommand(input$10(...keys));
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
		return this.useCommand(input$9(key, ...elements));
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
		return this.useCommand(input$8(key));
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
		return this.useCommand(input$7(key, member));
	}
	ZADD(key, arg1, arg2, arg3) {
		return this.useCommand(input$6(key, arg1, arg2, arg3));
	}
	ZREM(key, arg1, ...args_rest) {
		return this.useCommand(input$5(key, arg1, ...args_rest));
	}
	ZRANGE(key, start, stop, options) {
		return this.useCommand(input$4(key, start, stop, options));
	}
	ZINTERSTORE(destination, arg1, options) {
		return this.useCommand(input$3(destination, arg1, options));
	}
	HSET(key, arg1, arg2) {
		return this.useCommand(input$2(key, arg1, arg2));
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
		return this.useCommand(input$1(key));
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
		return this.useCommand(input$27(key));
	}
	SET(key, value, options) {
		return this.useCommand(input$26(key, value, options));
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
		return this.useCommand(input$25(key, seconds, options));
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
		return this.useCommand(input$24(key));
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
		return this.useCommand(input$23(key));
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
		return this.useCommand(input$22(key, seconds, options));
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
		return this.useCommand(input$21(key));
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
		return this.useCommand(input$20(pattern));
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
		return this.useCommand(input$19(source, destination, options));
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
		return this.useCommand(input$18(key, timestamp, options));
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
		return this.useCommand(input$17(key, timestamp, options));
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
		return this.useCommand(input$16(key));
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
		return this.useCommand(input$15(key));
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
		return this.useCommand(input$14(key, newkey));
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
		return this.useCommand(input$13(key, newkey));
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
		return this.useCommand(input$12(key));
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
		return this.useCommand(input$11(...keys));
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
		return this.useCommand(input$10(...keys));
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
		return this.useCommand(input$9(key, ...elements));
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
		return this.useCommand(input$8(key));
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
		return this.useCommand(input$7(key, member));
	}
	ZADD(key, arg1, arg2, arg3) {
		return this.useCommand(input$6(key, arg1, arg2, arg3));
	}
	ZREM(key, arg1, ...args_rest) {
		return this.useCommand(input$5(key, arg1, ...args_rest));
	}
	ZRANGE(key, start, stop, options) {
		return this.useCommand(input$4(key, start, stop, options));
	}
	ZINTERSTORE(destination, arg1, options) {
		return this.useCommand(input$3(destination, arg1, options));
	}
	HSET(key, arg1, arg2) {
		return this.useCommand(input$2(key, arg1, arg2));
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
		return this.useCommand(input$1(key));
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
		return this.useCommand(input$27(key));
	}
	SET(key, value, options) {
		return this.useCommand(input$26(key, value, options));
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
		return this.useCommand(input$25(key, seconds, options));
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
		return this.useCommand(input$24(key));
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
		return this.useCommand(input$23(key));
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
		return this.useCommand(input$22(key, seconds, options));
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
		return this.useCommand(input$21(key));
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
		return this.useCommand(input$20(pattern));
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
		return this.useCommand(input$19(source, destination, options));
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
		return this.useCommand(input$18(key, timestamp, options));
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
		return this.useCommand(input$17(key, timestamp, options));
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
		return this.useCommand(input$16(key));
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
		return this.useCommand(input$15(key));
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
		return this.useCommand(input$14(key, newkey));
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
		return this.useCommand(input$13(key, newkey));
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
		return this.useCommand(input$12(key));
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
		return this.useCommand(input$11(...keys));
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
		return this.useCommand(input$10(...keys));
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
		return this.useCommand(input$9(key, ...elements));
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
		return this.useCommand(input$8(key));
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
		return this.useCommand(input$7(key, member));
	}
	ZADD(key, arg1, arg2, arg3) {
		return this.useCommand(input$6(key, arg1, arg2, arg3));
	}
	ZREM(key, arg1, ...args_rest) {
		return this.useCommand(input$5(key, arg1, ...args_rest));
	}
	ZRANGE(key, start, stop, options) {
		return this.useCommand(input$4(key, start, stop, options));
	}
	ZINTERSTORE(destination, arg1, options) {
		return this.useCommand(input$3(destination, arg1, options));
	}
	HSET(key, arg1, arg2) {
		return this.useCommand(input$2(key, arg1, arg2));
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
		return this.useCommand(input$1(key));
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
exports.RedisXClient = RedisXClient;