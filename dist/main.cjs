Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
//#region src/script.ts
var RedisXScript = class {
	#redisClient;
	#options;
	#sha = null;
	constructor(redisClient, options) {
		this.#redisClient = redisClient;
		this.#options = options;
	}
	async load() {
		const result = await this.#redisClient.sendCommand([
			"SCRIPT",
			"LOAD",
			this.#options.code
		]);
		if (typeof result !== "string") throw new TypeError("Invalid response from SCRIPT LOAD");
		this.#sha = result;
		return result;
	}
	execute(...args) {
		return this.executeWithKeys(this.#options.keys ?? [], ...args);
	}
	async executeWithKeys(keys, ...args) {
		this.#sha ??= await this.load();
		try {
			const result = await this.#redisClient.sendCommand([
				"EVALSHA",
				this.#sha,
				String(keys.length),
				...keys,
				...this.#options.inputValidator ? this.#options.inputValidator(args).map(String) : args
			]);
			return this.#options.outputValidator ? this.#options.outputValidator(result) : result;
		} catch (error) {
			if (error instanceof Error && error.message.startsWith("NOSCRIPT")) {
				this.#sha = null;
				return this.executeWithKeys(keys, ...args);
			}
			throw error;
		}
	}
};
//#endregion
//#region src/utils.ts
function isPlainObject(value) {
	return typeof value === "object" && value !== null && !Array.isArray(value) && value.constructor === Object && Object.getPrototypeOf(value) === Object.prototype;
}
function stringBulkToObject(values) {
	const object = {};
	for (let index = 0; index < values.length; index += 2) Object.defineProperty(object, values[index], {
		value: values[index + 1],
		writable: true,
		enumerable: true,
		configurable: true
	});
	return object;
}
function collectionToStringArray(values) {
	return Array.from(values, String);
}
//#endregion
//#region src/transaction/command.ts
var RedisXTransactionCommand = class {
	index;
	_type;
	constructor(index) {
		this.index = index;
	}
};
function unwrapRedisTransactionCommand(target, result) {
	if (target instanceof RedisXTransactionCommand) return result[target.index];
	if (Array.isArray(target)) for (const [index, value] of target.entries()) target[index] = unwrapRedisTransactionCommand(value, result);
	else if (isPlainObject(target)) for (const [key, value] of Object.entries(target)) target[key] = unwrapRedisTransactionCommand(value, result);
	return target;
}
//#endregion
//#region src/commands/set/sintercard.ts
function input$119(keys, options) {
	const key_list = collectionToStringArray(keys);
	const args = [
		"SINTERCARD",
		String(key_list.length),
		...key_list
	];
	if ((options === null || options === void 0 ? void 0 : options.LIMIT) !== void 0) args.push("LIMIT", String(options.LIMIT));
	return {
		kind: "#schema",
		args
	};
}
//#endregion
//#region src/commands/set/srem.ts
function input$118(key, arg1, ...args_rest) {
	const args = ["SREM", key];
	if (typeof arg1 === "string" || typeof arg1 === "number") args.push(String(arg1), ...args_rest.map(String));
	else args.push(...collectionToStringArray(arg1));
	return {
		kind: "#schema",
		args
	};
}
//#endregion
//#region src/commands/set/srandmember.ts
function input$117(key, count) {
	const args = ["SRANDMEMBER", key];
	if (count !== void 0) args.push(String(count));
	return {
		kind: "#schema",
		args
	};
}
//#endregion
//#region src/reply-transformers/array-to-set.ts
function arrayToSet(reply) {
	return new Set(reply);
}
//#endregion
//#region src/commands/set/spop.ts
function input$116(key, count) {
	if (count === void 0) return {
		kind: "#schema",
		args: ["SPOP", key]
	};
	return {
		kind: "#schema",
		args: [
			"SPOP",
			key,
			String(count)
		],
		replyTransform: arrayToSet
	};
}
//#endregion
//#region src/commands/set/sinterstore.ts
function input$115(destination, arg1, ...args_rest) {
	const args = ["SINTERSTORE", destination];
	if (typeof arg1 === "string") args.push(arg1, ...args_rest);
	else args.push(...collectionToStringArray(arg1));
	return {
		kind: "#schema",
		args
	};
}
//#endregion
//#region src/commands/set/smismember.ts
function input$114(key, arg1, ...args_rest) {
	const args = ["SMISMEMBER", key];
	if (typeof arg1 === "string" || typeof arg1 === "number") args.push(String(arg1), ...args_rest.map(String));
	else args.push(...collectionToStringArray(arg1));
	return {
		kind: "#schema",
		args,
		replyTransform
	};
}
function replyTransform(reply) {
	return reply.map((value) => value === 1);
}
//#endregion
//#region src/commands/set/sinter.ts
function input$113(arg0, ...args_rest) {
	const args = ["SINTER"];
	if (typeof arg0 === "string") args.push(arg0, ...args_rest);
	else args.push(...collectionToStringArray(arg0));
	return {
		kind: "#schema",
		args,
		replyTransform: arrayToSet
	};
}
//#endregion
//#region src/commands/set/smembers.ts
function input$112(key) {
	return {
		kind: "#schema",
		args: ["SMEMBERS", key],
		replyTransform: arrayToSet
	};
}
//#endregion
//#region src/commands/set/sunion.ts
function input$111(arg0, ...args_rest) {
	const args = ["SUNION"];
	if (typeof arg0 === "string") args.push(arg0, ...args_rest);
	else args.push(...collectionToStringArray(arg0));
	return {
		kind: "#schema",
		args,
		replyTransform: arrayToSet
	};
}
//#endregion
//#region src/reply-transformers/number-to-boolean.ts
function numberToBoolean(reply) {
	return reply === 1;
}
//#endregion
//#region src/commands/set/sismember.ts
function input$110(key, member) {
	return {
		kind: "#schema",
		args: [
			"SISMEMBER",
			key,
			String(member)
		],
		replyTransform: numberToBoolean
	};
}
//#endregion
//#region src/commands/set/sunionstore.ts
function input$109(destination, arg1, ...args_rest) {
	const args = ["SUNIONSTORE", destination];
	if (typeof arg1 === "string") args.push(arg1, ...args_rest);
	else args.push(...collectionToStringArray(arg1));
	return {
		kind: "#schema",
		args
	};
}
//#endregion
//#region src/commands/set/smove.ts
function input$108(source, destination, member) {
	return {
		kind: "#schema",
		args: [
			"SMOVE",
			source,
			destination,
			String(member)
		],
		replyTransform: numberToBoolean
	};
}
//#endregion
//#region src/commands/set/sdiff.ts
function input$107(arg0, ...args_rest) {
	const args = ["SDIFF"];
	if (typeof arg0 === "string") args.push(arg0, ...args_rest);
	else args.push(...collectionToStringArray(arg0));
	return {
		kind: "#schema",
		args,
		replyTransform: arrayToSet
	};
}
//#endregion
//#region src/commands/set/sunioncard.ts
function input$106(keys, options) {
	const key_list = collectionToStringArray(keys);
	const args = [
		"SUNIONCARD",
		String(key_list.length),
		...key_list
	];
	if (options === null || options === void 0 ? void 0 : options.APPROX) args.push("APPROX");
	if ((options === null || options === void 0 ? void 0 : options.LIMIT) !== void 0) args.push("LIMIT", String(options.LIMIT));
	return {
		kind: "#schema",
		args
	};
}
//#endregion
//#region src/commands/set/sdiffstore.ts
function input$105(destination, arg1, ...args_rest) {
	const args = ["SDIFFSTORE", destination];
	if (typeof arg1 === "string") args.push(arg1, ...args_rest);
	else args.push(...collectionToStringArray(arg1));
	return {
		kind: "#schema",
		args
	};
}
//#endregion
//#region src/commands/set/scard.ts
function input$104(key) {
	return {
		kind: "#schema",
		args: ["SCARD", key]
	};
}
//#endregion
//#region src/commands/set/sdiffcard.ts
function input$103(keys, options) {
	const key_list = collectionToStringArray(keys);
	const args = [
		"SDIFFCARD",
		String(key_list.length),
		...key_list
	];
	if ((options === null || options === void 0 ? void 0 : options.LIMIT) !== void 0) args.push("LIMIT", String(options.LIMIT));
	return {
		kind: "#schema",
		args
	};
}
//#endregion
//#region src/commands/set/sadd.ts
function input$102(key, arg1, ...args_rest) {
	const args = ["SADD", key];
	if (typeof arg1 === "string" || typeof arg1 === "number") args.push(String(arg1), ...args_rest.map(String));
	else args.push(...collectionToStringArray(arg1));
	return {
		kind: "#schema",
		args
	};
}
//#endregion
//#region src/commands/string/msetnx.ts
function input$101(pairs) {
	const args = ["MSETNX"];
	for (const [key, value] of Object.entries(pairs)) args.push(key, String(value));
	return {
		kind: "#schema",
		args,
		replyTransform: numberToBoolean
	};
}
//#endregion
//#region src/commands/string/setnx.ts
function input$100(key, value) {
	return {
		kind: "#schema",
		args: [
			"SETNX",
			key,
			String(value)
		],
		replyTransform: numberToBoolean
	};
}
//#endregion
//#region src/commands/string/get.ts
function input$99(key) {
	return {
		kind: "#schema",
		args: ["GET", key]
	};
}
//#endregion
//#region src/commands/string/set.ts
function input$98(key, value, options) {
	const args_options = [];
	if (options) {
		if (options.NX) args_options.push("NX");
		if (options.XX) args_options.push("XX");
		if (options.IFEQ !== void 0) args_options.push("IFEQ", String(options.IFEQ));
		if (options.IFNE !== void 0) args_options.push("IFNE", String(options.IFNE));
		if (options.IFDEQ !== void 0) args_options.push("IFDEQ", options.IFDEQ);
		if (options.IFDNE !== void 0) args_options.push("IFDNE", options.IFDNE);
		if (options.EX !== void 0) args_options.push("EX", String(options.EX));
		if (options.PX !== void 0) args_options.push("PX", String(options.PX));
		if (options.EXAT !== void 0) args_options.push("EXAT", String(options.EXAT));
		if (options.PXAT !== void 0) args_options.push("PXAT", String(options.PXAT));
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
function input$97(key, value) {
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
function input$96(key) {
	return {
		kind: "#schema",
		args: ["INCR", key]
	};
}
//#endregion
//#region src/commands/string/incrbyfloat.ts
function input$95(key, increment) {
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
function input$94(...args) {
	return {
		kind: "#schema",
		args: ["MGET", ...args.flat()]
	};
}
//#endregion
//#region src/commands/string/getdel.ts
function input$93(key) {
	return {
		kind: "#schema",
		args: ["GETDEL", key]
	};
}
//#endregion
//#region src/commands/string/mset.ts
function input$92(pairs) {
	const args = ["MSET"];
	for (const [key, value] of Object.entries(pairs)) args.push(key, String(value));
	return {
		kind: "#schema",
		args
	};
}
//#endregion
//#region src/commands/string/incrby.ts
function input$91(key, increment) {
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
function input$90(key, offset, value) {
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
function input$89(key, start, end) {
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
function input$88(key, value) {
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
function input$87(key, decrement) {
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
function input$86(key, start, end) {
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
function input$85(key, seconds, value) {
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
function input$84(key, options) {
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
function input$83(key) {
	return {
		kind: "#schema",
		args: ["STRLEN", key]
	};
}
//#endregion
//#region src/commands/string/decr.ts
function input$82(key) {
	return {
		kind: "#schema",
		args: ["DECR", key]
	};
}
//#endregion
//#region src/commands/string/psetex.ts
function input$81(key, milliseconds, value) {
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
function input$80(key, seconds, options) {
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
		replyTransform: numberToBoolean
	};
}
//#endregion
//#region src/commands/generic/pttl.ts
function input$79(key) {
	return {
		kind: "#schema",
		args: ["PTTL", key]
	};
}
//#endregion
//#region src/commands/generic/ttl.ts
function input$78(key) {
	return {
		kind: "#schema",
		args: ["TTL", key]
	};
}
//#endregion
//#region src/commands/generic/expire.ts
function input$77(key, seconds, options) {
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
		replyTransform: numberToBoolean
	};
}
//#endregion
//#region src/commands/generic/type.ts
function input$76(key) {
	return {
		kind: "#schema",
		args: ["TYPE", key]
	};
}
//#endregion
//#region src/commands/generic/keys.ts
function input$75(pattern) {
	return {
		kind: "#schema",
		args: ["KEYS", pattern],
		replyTransform: arrayToSet
	};
}
//#endregion
//#region src/commands/generic/copy.ts
function input$74(source, destination, options) {
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
		replyTransform: numberToBoolean
	};
}
//#endregion
//#region src/commands/generic/expireat.ts
function input$73(key, timestamp, options) {
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
		replyTransform: numberToBoolean
	};
}
//#endregion
//#region src/commands/generic/pexpireat.ts
function input$72(key, timestamp, options) {
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
		replyTransform: numberToBoolean
	};
}
//#endregion
//#region src/commands/generic/persist.ts
function input$71(key) {
	return {
		kind: "#schema",
		args: ["PERSIST", key],
		replyTransform: numberToBoolean
	};
}
//#endregion
//#region src/commands/generic/expiretime.ts
function input$70(key) {
	return {
		kind: "#schema",
		args: ["EXPIRETIME", key]
	};
}
//#endregion
//#region src/commands/generic/rename.ts
function input$69(key, newkey) {
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
function input$68(key, newkey) {
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
function input$67(key) {
	return {
		kind: "#schema",
		args: ["PEXPIRETIME", key]
	};
}
//#endregion
//#region src/commands/generic/del.ts
function input$66(arg0, ...args_rest) {
	const args = ["DEL"];
	if (typeof arg0 === "string") args.push(arg0, ...args_rest);
	else args.push(...collectionToStringArray(arg0));
	return {
		kind: "#schema",
		args
	};
}
//#endregion
//#region src/commands/generic/exists.ts
function input$65(arg0, ...args_rest) {
	const args = ["EXISTS"];
	if (typeof arg0 === "string") args.push(arg0, ...args_rest);
	else args.push(...collectionToStringArray(arg0));
	return {
		kind: "#schema",
		args
	};
}
//#endregion
//#region src/commands/list/rpush.ts
function input$64(key, ...elements) {
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
function input$63(key, count) {
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
function input$62(source, destination) {
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
function input$61(key, ...elements) {
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
function input$60(key, index, element) {
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
function input$59(key, count, element) {
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
function input$58(key, ...elements) {
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
function input$57(key, ...elements) {
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
function input$56(key, count) {
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
function input$55(key, start, stop) {
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
function input$54(key) {
	return {
		kind: "#schema",
		args: ["LLEN", key]
	};
}
//#endregion
//#region src/commands/list/linsert.ts
function input$53(key, element, options) {
	const args = ["LINSERT", key];
	if (options.BEFORE !== void 0) args.push("BEFORE", String(options.BEFORE));
	if (options.AFTER !== void 0) args.push("AFTER", String(options.AFTER));
	args.push(String(element));
	return {
		kind: "#schema",
		args
	};
}
//#endregion
//#region src/commands/list/ltrim.ts
function input$52(key, start, stop) {
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
function input$51(key, index) {
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
function input$50(key) {
	return {
		kind: "#schema",
		args: ["XLEN", key]
	};
}
//#endregion
//#region src/commands/stream/xdel.ts
function input$49(key, ...ids) {
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
function input$48(arg0, arg1, arg2) {
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
function input$47(key, id, pairs, options) {
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
	cmdArgs.push(id);
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
//#region src/commands/stream/xrange.ts
function input$46(key, start, end, options) {
	const args = [
		"XRANGE",
		key,
		start,
		end
	];
	if ((options === null || options === void 0 ? void 0 : options.COUNT) !== void 0) args.push("COUNT", String(options.COUNT));
	return {
		kind: "#schema",
		args,
		replyTransform(reply) {
			return reply.map(([id, data]) => {
				return {
					id,
					data: stringBulkToObject(data)
				};
			});
		}
	};
}
//#endregion
//#region src/commands/stream/xrevrange.ts
function input$45(key, end, start, options) {
	const args = [
		"XREVRANGE",
		key,
		end,
		start
	];
	if ((options === null || options === void 0 ? void 0 : options.COUNT) !== void 0) args.push("COUNT", String(options.COUNT));
	return {
		kind: "#schema",
		args,
		replyTransform(reply) {
			return reply.map(([id, data]) => {
				return {
					id,
					data: stringBulkToObject(data)
				};
			});
		}
	};
}
//#endregion
//#region src/commands/stream/xtrim.ts
function input$44(key, strategy, threshold, options) {
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
//#region src/commands/sorted-set/zremrangebyrank.ts
function input$43(key, start, stop) {
	return {
		kind: "#schema",
		args: [
			"ZREMRANGEBYRANK",
			key,
			String(start),
			String(stop)
		]
	};
}
//#endregion
//#region src/commands/sorted-set/zcard.ts
function input$42(key) {
	return {
		kind: "#schema",
		args: ["ZCARD", key]
	};
}
//#endregion
//#region src/reply-transformers/double-to-number.ts
function doubleToNumber(reply) {
	switch (reply) {
		case "inf": return Infinity;
		case "-inf": return -Infinity;
		default: return Number(reply);
	}
}
//#endregion
//#region src/commands/sorted-set/zrangebyscore.ts
function input$41(key, min, max, options) {
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
					score: doubleToNumber(result[index + 1])
				});
				return transformed_result;
			}
			return result;
		}
	};
}
//#endregion
//#region src/commands/sorted-set/zrevrangebylex.ts
function input$40(key, max, min, options) {
	const args = [
		"ZREVRANGEBYLEX",
		key,
		max,
		min
	];
	if (options === null || options === void 0 ? void 0 : options.LIMIT) args.push("LIMIT", String(options.LIMIT[0]), String(options.LIMIT[1]));
	return {
		kind: "#schema",
		args
	};
}
//#endregion
//#region src/commands/sorted-set/zrevrangebyscore.ts
function input$39(key, max, min, options) {
	const args = [
		"ZREVRANGEBYSCORE",
		key,
		String(max),
		String(min)
	];
	if (options === null || options === void 0 ? void 0 : options.WITHSCORES) args.push("WITHSCORES");
	if (options === null || options === void 0 ? void 0 : options.LIMIT) args.push("LIMIT", String(options.LIMIT[0]), String(options.LIMIT[1]));
	return {
		kind: "#schema",
		args,
		replyTransform(result) {
			if (options === null || options === void 0 ? void 0 : options.WITHSCORES) {
				const transformed_result = [];
				for (let index = 0; index < result.length; index += 2) transformed_result.push({
					member: result[index],
					score: doubleToNumber(result[index + 1])
				});
				return transformed_result;
			}
			return result;
		}
	};
}
//#endregion
//#region src/commands/sorted-set/zscore.ts
function input$38(key, member) {
	return {
		kind: "#schema",
		args: [
			"ZSCORE",
			key,
			String(member)
		],
		replyTransform(result) {
			return result === null ? null : doubleToNumber(result);
		}
	};
}
//#endregion
//#region src/commands/sorted-set/zcount.ts
function input$37(key, min, max) {
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
function input$36(key, arg1, arg2, arg3) {
	const args = ["ZADD", key];
	const pairs = [];
	if (typeof arg1 === "number") pairs.push(String(arg1), String(arg2));
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
			if (typeof result === "string") return doubleToNumber(result);
			return result;
		}
	};
}
//#endregion
//#region src/commands/sorted-set/zrank.ts
function input$35(key, member, options) {
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
					score: doubleToNumber(score)
				};
			}
			return result;
		}
	};
}
//#endregion
//#region src/commands/sorted-set/zrandmember.ts
function input$34(key, count, options) {
	const args = ["ZRANDMEMBER", key];
	const has_withscores = count !== void 0 && (options === null || options === void 0 ? void 0 : options.WITHSCORES) === true;
	if (count !== void 0) args.push(String(count));
	if (has_withscores) args.push("WITHSCORES");
	return {
		kind: "#schema",
		args,
		replyTransform(result) {
			if (has_withscores) {
				const reply = result;
				const transformed_result = [];
				for (let index = 0; index < reply.length; index += 2) transformed_result.push({
					member: reply[index],
					score: doubleToNumber(reply[index + 1])
				});
				return transformed_result;
			}
			return result;
		}
	};
}
//#endregion
//#region src/commands/sorted-set/zrem.ts
function input$33(key, arg1, ...args_rest) {
	const args = ["ZREM", key];
	if (typeof arg1 === "string" || typeof arg1 === "number") args.push(String(arg1), ...args_rest.map(String));
	else args.push(...collectionToStringArray(arg1));
	return {
		kind: "#schema",
		args
	};
}
//#endregion
//#region src/commands/sorted-set/zremrangebyscore.ts
function input$32(key, min, max) {
	return {
		kind: "#schema",
		args: [
			"ZREMRANGEBYSCORE",
			key,
			String(min),
			String(max)
		]
	};
}
//#endregion
//#region src/commands/sorted-set/zrevrank.ts
function input$31(key, member, options) {
	const args = [
		"ZREVRANK",
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
					score: doubleToNumber(score)
				};
			}
			return result;
		}
	};
}
//#endregion
//#region src/commands/sorted-set/zrange.ts
function input$30(key, start, stop, options) {
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
					score: doubleToNumber(result[index + 1])
				});
				return transformed_result;
			}
			return result;
		}
	};
}
//#endregion
//#region src/commands/sorted-set/zincrby.ts
function input$29(key, increment, member) {
	return {
		kind: "#schema",
		args: [
			"ZINCRBY",
			key,
			String(increment),
			String(member)
		],
		replyTransform: doubleToNumber
	};
}
//#endregion
//#region src/commands/sorted-set/zremrangebylex.ts
function input$28(key, min, max) {
	return {
		kind: "#schema",
		args: [
			"ZREMRANGEBYLEX",
			key,
			min,
			max
		]
	};
}
//#endregion
//#region src/commands/sorted-set/zinterstore.ts
function input$27(destination, arg1, options) {
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
//#region src/commands/sorted-set/zrevrange.ts
function input$26(key, start, stop, options) {
	const args = [
		"ZREVRANGE",
		key,
		String(start),
		String(stop)
	];
	if (options === null || options === void 0 ? void 0 : options.WITHSCORES) args.push("WITHSCORES");
	return {
		kind: "#schema",
		args,
		replyTransform(result) {
			if (options === null || options === void 0 ? void 0 : options.WITHSCORES) {
				const transformed_result = [];
				for (let index = 0; index < result.length; index += 2) transformed_result.push({
					member: result[index],
					score: doubleToNumber(result[index + 1])
				});
				return transformed_result;
			}
			return result;
		}
	};
}
//#endregion
//#region src/commands/sorted-set/zrangebylex.ts
function input$25(key, min, max, options) {
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
function input$24(key) {
	return {
		kind: "#schema",
		args: ["HVALS", key]
	};
}
//#endregion
//#region src/commands/hash/hset.ts
function input$23(key, arg1, arg2) {
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
function input$22(key, field, increment) {
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
function input$21(key) {
	return {
		kind: "#schema",
		args: ["HGETALL", key],
		replyTransform: stringBulkToObject
	};
}
//#endregion
//#region src/commands/hash/hget.ts
function input$20(key, field) {
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
//#region src/commands/hash/hpexpire.ts
function input$19(key, milliseconds, fields, options) {
	const args = [
		"HPEXPIRE",
		key,
		String(milliseconds)
	];
	if (options === null || options === void 0 ? void 0 : options.NX) args.push("NX");
	if (options === null || options === void 0 ? void 0 : options.XX) args.push("XX");
	if (options === null || options === void 0 ? void 0 : options.GT) args.push("GT");
	if (options === null || options === void 0 ? void 0 : options.LT) args.push("LT");
	const field_list = collectionToStringArray(fields);
	args.push("FIELDS", String(field_list.length), ...field_list);
	return {
		kind: "#schema",
		args
	};
}
//#endregion
//#region src/commands/hash/hexpire.ts
function input$18(key, seconds, fields, options) {
	const args = [
		"HEXPIRE",
		key,
		String(seconds)
	];
	if (options === null || options === void 0 ? void 0 : options.NX) args.push("NX");
	if (options === null || options === void 0 ? void 0 : options.XX) args.push("XX");
	if (options === null || options === void 0 ? void 0 : options.GT) args.push("GT");
	if (options === null || options === void 0 ? void 0 : options.LT) args.push("LT");
	const field_list = collectionToStringArray(fields);
	args.push("FIELDS", String(field_list.length), ...field_list);
	return {
		kind: "#schema",
		args
	};
}
//#endregion
//#region src/commands/hash/hmset.ts
function input$17(key, arg1, arg2) {
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
function input$16(key, ...fields) {
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
//#region src/commands/hash/hexpireat.ts
function input$15(key, timestamp, fields, options) {
	const args = [
		"HEXPIREAT",
		key,
		String(timestamp)
	];
	if (options === null || options === void 0 ? void 0 : options.NX) args.push("NX");
	if (options === null || options === void 0 ? void 0 : options.XX) args.push("XX");
	if (options === null || options === void 0 ? void 0 : options.GT) args.push("GT");
	if (options === null || options === void 0 ? void 0 : options.LT) args.push("LT");
	const field_list = collectionToStringArray(fields);
	args.push("FIELDS", String(field_list.length), ...field_list);
	return {
		kind: "#schema",
		args
	};
}
//#endregion
//#region src/commands/hash/hrandfield.ts
function input$14(key, count, options) {
	const args = ["HRANDFIELD", key];
	const has_withvalues = count !== void 0 && (options === null || options === void 0 ? void 0 : options.WITHVALUES) === true;
	if (count !== void 0) args.push(String(count));
	if (has_withvalues) args.push("WITHVALUES");
	return {
		kind: "#schema",
		args,
		replyTransform(result) {
			if (has_withvalues) {
				const reply = result;
				const transformed_result = [];
				for (let index = 0; index < reply.length; index += 2) transformed_result.push({
					field: reply[index],
					value: reply[index + 1]
				});
				return transformed_result;
			}
			return result;
		}
	};
}
//#endregion
//#region src/commands/hash/hlen.ts
function input$13(key) {
	return {
		kind: "#schema",
		args: ["HLEN", key]
	};
}
//#endregion
//#region src/commands/hash/hkeys.ts
function input$12(key) {
	return {
		kind: "#schema",
		args: ["HKEYS", key],
		replyTransform: arrayToSet
	};
}
//#endregion
//#region src/commands/hash/hincrby.ts
function input$11(key, field, increment) {
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
function input$10(key, arg1, ...args_rest) {
	const args = ["HDEL", key];
	if (typeof arg1 === "string" || typeof arg1 === "number") args.push(String(arg1), ...args_rest.map(String));
	else args.push(...collectionToStringArray(arg1));
	return {
		kind: "#schema",
		args
	};
}
//#endregion
//#region src/commands/hash/hstrlen.ts
function input$9(key, field) {
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
//#region src/commands/hash/hpexpiretime.ts
function input$8(key, fields) {
	const field_list = collectionToStringArray(fields);
	return {
		kind: "#schema",
		args: [
			"HPEXPIRETIME",
			key,
			"FIELDS",
			String(field_list.length),
			...field_list
		]
	};
}
//#endregion
//#region src/commands/hash/hexists.ts
function input$7(key, field) {
	return {
		kind: "#schema",
		args: [
			"HEXISTS",
			key,
			String(field)
		],
		replyTransform: numberToBoolean
	};
}
//#endregion
//#region src/commands/hash/hpexpireat.ts
function input$6(key, timestamp, fields, options) {
	const args = [
		"HPEXPIREAT",
		key,
		String(timestamp)
	];
	if (options === null || options === void 0 ? void 0 : options.NX) args.push("NX");
	if (options === null || options === void 0 ? void 0 : options.XX) args.push("XX");
	if (options === null || options === void 0 ? void 0 : options.GT) args.push("GT");
	if (options === null || options === void 0 ? void 0 : options.LT) args.push("LT");
	const field_list = collectionToStringArray(fields);
	args.push("FIELDS", String(field_list.length), ...field_list);
	return {
		kind: "#schema",
		args
	};
}
//#endregion
//#region src/commands/hash/hsetnx.ts
function input$5(key, field, value) {
	return {
		kind: "#schema",
		args: [
			"HSETNX",
			key,
			field,
			String(value)
		],
		replyTransform: numberToBoolean
	};
}
//#endregion
//#region src/commands/hash/hexpiretime.ts
function input$4(key, fields) {
	const field_list = collectionToStringArray(fields);
	return {
		kind: "#schema",
		args: [
			"HEXPIRETIME",
			key,
			"FIELDS",
			String(field_list.length),
			...field_list
		]
	};
}
//#endregion
//#region src/commands/scripting/eval_ro.ts
function input$3(script, keys, args) {
	const command_args = [
		"EVAL_RO",
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
//#region src/commands/scripting/eval.ts
function input$2(script, keys, args) {
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
//#region src/commands/scripting/evalsha.ts
function input$1(sha1, keys, args) {
	const command_args = [
		"EVALSHA",
		sha1,
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
//#region src/commands/scripting/evalsha_ro.ts
function input(sha1, keys, args) {
	const command_args = [
		"EVALSHA_RO",
		sha1,
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
	transaction;
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
	SINTERCARD(keys, options) {
		return this.useCommand(input$119(keys, options));
	}
	SREM(key, arg1, ...args_rest) {
		return this.useCommand(input$118(key, arg1, ...args_rest));
	}
	SRANDMEMBER(key, count) {
		return this.useCommand(input$117(key, count));
	}
	SPOP(key, count) {
		return this.useCommand(input$116(key, count));
	}
	SINTERSTORE(destination, arg1, ...args_rest) {
		return this.useCommand(input$115(destination, arg1, ...args_rest));
	}
	SMISMEMBER(key, arg1, ...args_rest) {
		return this.useCommand(input$114(key, arg1, ...args_rest));
	}
	SINTER(arg0, ...args_rest) {
		return this.useCommand(input$113(arg0, ...args_rest));
	}
	SMEMBERS(key) {
		return this.useCommand(input$112(key));
	}
	SUNION(arg0, ...args_rest) {
		return this.useCommand(input$111(arg0, ...args_rest));
	}
	SISMEMBER(key, member) {
		return this.useCommand(input$110(key, member));
	}
	SUNIONSTORE(destination, arg1, ...args_rest) {
		return this.useCommand(input$109(destination, arg1, ...args_rest));
	}
	SMOVE(source, destination, member) {
		return this.useCommand(input$108(source, destination, member));
	}
	SDIFF(arg0, ...args_rest) {
		return this.useCommand(input$107(arg0, ...args_rest));
	}
	SUNIONCARD(keys, options) {
		return this.useCommand(input$106(keys, options));
	}
	SDIFFSTORE(destination, arg1, ...args_rest) {
		return this.useCommand(input$105(destination, arg1, ...args_rest));
	}
	SCARD(key) {
		return this.useCommand(input$104(key));
	}
	SDIFFCARD(keys, options) {
		return this.useCommand(input$103(keys, options));
	}
	SADD(key, arg1, ...args_rest) {
		return this.useCommand(input$102(key, arg1, ...args_rest));
	}
	MSETNX(pairs) {
		return this.useCommand(input$101(pairs));
	}
	SETNX(key, value) {
		return this.useCommand(input$100(key, value));
	}
	GET(key) {
		return this.useCommand(input$99(key));
	}
	SET(key, value, options) {
		return this.useCommand(input$98(key, value, options));
	}
	APPEND(key, value) {
		return this.useCommand(input$97(key, value));
	}
	INCR(key) {
		return this.useCommand(input$96(key));
	}
	INCRBYFLOAT(key, increment) {
		return this.useCommand(input$95(key, increment));
	}
	MGET(...args) {
		return this.useCommand(input$94(...args));
	}
	GETDEL(key) {
		return this.useCommand(input$93(key));
	}
	MSET(pairs) {
		return this.useCommand(input$92(pairs));
	}
	INCRBY(key, increment) {
		return this.useCommand(input$91(key, increment));
	}
	SETRANGE(key, offset, value) {
		return this.useCommand(input$90(key, offset, value));
	}
	SUBSTR(key, start, end) {
		return this.useCommand(input$89(key, start, end));
	}
	GETSET(key, value) {
		return this.useCommand(input$88(key, value));
	}
	DECRBY(key, decrement) {
		return this.useCommand(input$87(key, decrement));
	}
	GETRANGE(key, start, end) {
		return this.useCommand(input$86(key, start, end));
	}
	SETEX(key, seconds, value) {
		return this.useCommand(input$85(key, seconds, value));
	}
	GETEX(key, options) {
		return this.useCommand(input$84(key, options));
	}
	STRLEN(key) {
		return this.useCommand(input$83(key));
	}
	DECR(key) {
		return this.useCommand(input$82(key));
	}
	PSETEX(key, milliseconds, value) {
		return this.useCommand(input$81(key, milliseconds, value));
	}
	PEXPIRE(key, seconds, options) {
		return this.useCommand(input$80(key, seconds, options));
	}
	PTTL(key) {
		return this.useCommand(input$79(key));
	}
	TTL(key) {
		return this.useCommand(input$78(key));
	}
	EXPIRE(key, seconds, options) {
		return this.useCommand(input$77(key, seconds, options));
	}
	TYPE(key) {
		return this.useCommand(input$76(key));
	}
	KEYS(pattern) {
		return this.useCommand(input$75(pattern));
	}
	COPY(source, destination, options) {
		return this.useCommand(input$74(source, destination, options));
	}
	EXPIREAT(key, timestamp, options) {
		return this.useCommand(input$73(key, timestamp, options));
	}
	PEXPIREAT(key, timestamp, options) {
		return this.useCommand(input$72(key, timestamp, options));
	}
	PERSIST(key) {
		return this.useCommand(input$71(key));
	}
	EXPIRETIME(key) {
		return this.useCommand(input$70(key));
	}
	RENAME(key, newkey) {
		return this.useCommand(input$69(key, newkey));
	}
	RENAMENX(key, newkey) {
		return this.useCommand(input$68(key, newkey));
	}
	PEXPIRETIME(key) {
		return this.useCommand(input$67(key));
	}
	DEL(arg0, ...args_rest) {
		return this.useCommand(input$66(arg0, ...args_rest));
	}
	EXISTS(arg0, ...args_rest) {
		return this.useCommand(input$65(arg0, ...args_rest));
	}
	RPUSH(key, ...elements) {
		return this.useCommand(input$64(key, ...elements));
	}
	LPOP(key, count) {
		return this.useCommand(input$63(key, count));
	}
	RPOPLPUSH(source, destination) {
		return this.useCommand(input$62(source, destination));
	}
	RPUSHX(key, ...elements) {
		return this.useCommand(input$61(key, ...elements));
	}
	LSET(key, index, element) {
		return this.useCommand(input$60(key, index, element));
	}
	LREM(key, count, element) {
		return this.useCommand(input$59(key, count, element));
	}
	LPUSH(key, ...elements) {
		return this.useCommand(input$58(key, ...elements));
	}
	LPUSHX(key, ...elements) {
		return this.useCommand(input$57(key, ...elements));
	}
	RPOP(key, count) {
		return this.useCommand(input$56(key, count));
	}
	LRANGE(key, start, stop) {
		return this.useCommand(input$55(key, start, stop));
	}
	LLEN(key) {
		return this.useCommand(input$54(key));
	}
	LINSERT(key, element, options) {
		return this.useCommand(input$53(key, element, options));
	}
	LTRIM(key, start, stop) {
		return this.useCommand(input$52(key, start, stop));
	}
	LINDEX(key, index) {
		return this.useCommand(input$51(key, index));
	}
	XLEN(key) {
		return this.useCommand(input$50(key));
	}
	XDEL(key, ...ids) {
		return this.useCommand(input$49(key, ...ids));
	}
	XREAD(arg0, arg1, arg2) {
		return this.useCommand(input$48(arg0, arg1, arg2));
	}
	XADD(key, id, pairs, options) {
		return this.useCommand(input$47(key, id, pairs, options));
	}
	XRANGE(key, start, end, options) {
		return this.useCommand(input$46(key, start, end, options));
	}
	XREVRANGE(key, end, start, options) {
		return this.useCommand(input$45(key, end, start, options));
	}
	XTRIM(key, strategy, threshold, options) {
		return this.useCommand(input$44(key, strategy, threshold, options));
	}
	ZREMRANGEBYRANK(key, start, stop) {
		return this.useCommand(input$43(key, start, stop));
	}
	ZCARD(key) {
		return this.useCommand(input$42(key));
	}
	ZRANGEBYSCORE(key, min, max, options) {
		return this.useCommand(input$41(key, min, max, options));
	}
	ZREVRANGEBYLEX(key, max, min, options) {
		return this.useCommand(input$40(key, max, min, options));
	}
	ZREVRANGEBYSCORE(key, max, min, options) {
		return this.useCommand(input$39(key, max, min, options));
	}
	ZSCORE(key, member) {
		return this.useCommand(input$38(key, member));
	}
	ZCOUNT(key, min, max) {
		return this.useCommand(input$37(key, min, max));
	}
	ZADD(key, arg1, arg2, arg3) {
		return this.useCommand(input$36(key, arg1, arg2, arg3));
	}
	ZRANK(key, member, options) {
		return this.useCommand(input$35(key, member, options));
	}
	ZRANDMEMBER(key, count, options) {
		return this.useCommand(input$34(key, count, options));
	}
	ZREM(key, arg1, ...args_rest) {
		return this.useCommand(input$33(key, arg1, ...args_rest));
	}
	ZREMRANGEBYSCORE(key, min, max) {
		return this.useCommand(input$32(key, min, max));
	}
	ZREVRANK(key, member, options) {
		return this.useCommand(input$31(key, member, options));
	}
	ZRANGE(key, start, stop, options) {
		return this.useCommand(input$30(key, start, stop, options));
	}
	ZINCRBY(key, increment, member) {
		return this.useCommand(input$29(key, increment, member));
	}
	ZREMRANGEBYLEX(key, min, max) {
		return this.useCommand(input$28(key, min, max));
	}
	ZINTERSTORE(destination, arg1, options) {
		return this.useCommand(input$27(destination, arg1, options));
	}
	ZREVRANGE(key, start, stop, options) {
		return this.useCommand(input$26(key, start, stop, options));
	}
	ZRANGEBYLEX(key, min, max, options) {
		return this.useCommand(input$25(key, min, max, options));
	}
	HVALS(key) {
		return this.useCommand(input$24(key));
	}
	HSET(key, arg1, arg2) {
		return this.useCommand(input$23(key, arg1, arg2));
	}
	HINCRBYFLOAT(key, field, increment) {
		return this.useCommand(input$22(key, field, increment));
	}
	HGETALL(key) {
		return this.useCommand(input$21(key));
	}
	HGET(key, field) {
		return this.useCommand(input$20(key, field));
	}
	HPEXPIRE(key, milliseconds, fields, options) {
		return this.useCommand(input$19(key, milliseconds, fields, options));
	}
	HEXPIRE(key, seconds, fields, options) {
		return this.useCommand(input$18(key, seconds, fields, options));
	}
	HMSET(key, arg1, arg2) {
		return this.useCommand(input$17(key, arg1, arg2));
	}
	HMGET(key, ...fields) {
		return this.useCommand(input$16(key, ...fields));
	}
	HEXPIREAT(key, timestamp, fields, options) {
		return this.useCommand(input$15(key, timestamp, fields, options));
	}
	HRANDFIELD(key, count, options) {
		return this.useCommand(input$14(key, count, options));
	}
	HLEN(key) {
		return this.useCommand(input$13(key));
	}
	HKEYS(key) {
		return this.useCommand(input$12(key));
	}
	HINCRBY(key, field, increment) {
		return this.useCommand(input$11(key, field, increment));
	}
	HDEL(key, arg1, ...args_rest) {
		return this.useCommand(input$10(key, arg1, ...args_rest));
	}
	HSTRLEN(key, field) {
		return this.useCommand(input$9(key, field));
	}
	HPEXPIRETIME(key, fields) {
		return this.useCommand(input$8(key, fields));
	}
	HEXISTS(key, field) {
		return this.useCommand(input$7(key, field));
	}
	HPEXPIREAT(key, timestamp, fields, options) {
		return this.useCommand(input$6(key, timestamp, fields, options));
	}
	HSETNX(key, field, value) {
		return this.useCommand(input$5(key, field, value));
	}
	HEXPIRETIME(key, fields) {
		return this.useCommand(input$4(key, fields));
	}
	EVAL_RO(script, keys, args) {
		return this.useCommand(input$3(script, keys, args));
	}
	EVAL(script, keys, args) {
		return this.useCommand(input$2(script, keys, args));
	}
	EVALSHA(sha1, keys, args) {
		return this.useCommand(input$1(sha1, keys, args));
	}
	EVALSHA_RO(sha1, keys, args) {
		return this.useCommand(input(sha1, keys, args));
	}
};
//#endregion
//#region src/transaction.ts
var RedisXTransaction = class {
	multi;
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
	SINTERCARD(keys, options) {
		return this.useCommand(input$119(keys, options));
	}
	SREM(key, arg1, ...args_rest) {
		return this.useCommand(input$118(key, arg1, ...args_rest));
	}
	SRANDMEMBER(key, count) {
		return this.useCommand(input$117(key, count));
	}
	SPOP(key, count) {
		return this.useCommand(input$116(key, count));
	}
	SINTERSTORE(destination, arg1, ...args_rest) {
		return this.useCommand(input$115(destination, arg1, ...args_rest));
	}
	SMISMEMBER(key, arg1, ...args_rest) {
		return this.useCommand(input$114(key, arg1, ...args_rest));
	}
	SINTER(arg0, ...args_rest) {
		return this.useCommand(input$113(arg0, ...args_rest));
	}
	SMEMBERS(key) {
		return this.useCommand(input$112(key));
	}
	SUNION(arg0, ...args_rest) {
		return this.useCommand(input$111(arg0, ...args_rest));
	}
	SISMEMBER(key, member) {
		return this.useCommand(input$110(key, member));
	}
	SUNIONSTORE(destination, arg1, ...args_rest) {
		return this.useCommand(input$109(destination, arg1, ...args_rest));
	}
	SMOVE(source, destination, member) {
		return this.useCommand(input$108(source, destination, member));
	}
	SDIFF(arg0, ...args_rest) {
		return this.useCommand(input$107(arg0, ...args_rest));
	}
	SUNIONCARD(keys, options) {
		return this.useCommand(input$106(keys, options));
	}
	SDIFFSTORE(destination, arg1, ...args_rest) {
		return this.useCommand(input$105(destination, arg1, ...args_rest));
	}
	SCARD(key) {
		return this.useCommand(input$104(key));
	}
	SDIFFCARD(keys, options) {
		return this.useCommand(input$103(keys, options));
	}
	SADD(key, arg1, ...args_rest) {
		return this.useCommand(input$102(key, arg1, ...args_rest));
	}
	MSETNX(pairs) {
		return this.useCommand(input$101(pairs));
	}
	SETNX(key, value) {
		return this.useCommand(input$100(key, value));
	}
	GET(key) {
		return this.useCommand(input$99(key));
	}
	SET(key, value, options) {
		return this.useCommand(input$98(key, value, options));
	}
	APPEND(key, value) {
		return this.useCommand(input$97(key, value));
	}
	INCR(key) {
		return this.useCommand(input$96(key));
	}
	INCRBYFLOAT(key, increment) {
		return this.useCommand(input$95(key, increment));
	}
	MGET(...args) {
		return this.useCommand(input$94(...args));
	}
	GETDEL(key) {
		return this.useCommand(input$93(key));
	}
	MSET(pairs) {
		return this.useCommand(input$92(pairs));
	}
	INCRBY(key, increment) {
		return this.useCommand(input$91(key, increment));
	}
	SETRANGE(key, offset, value) {
		return this.useCommand(input$90(key, offset, value));
	}
	SUBSTR(key, start, end) {
		return this.useCommand(input$89(key, start, end));
	}
	GETSET(key, value) {
		return this.useCommand(input$88(key, value));
	}
	DECRBY(key, decrement) {
		return this.useCommand(input$87(key, decrement));
	}
	GETRANGE(key, start, end) {
		return this.useCommand(input$86(key, start, end));
	}
	SETEX(key, seconds, value) {
		return this.useCommand(input$85(key, seconds, value));
	}
	GETEX(key, options) {
		return this.useCommand(input$84(key, options));
	}
	STRLEN(key) {
		return this.useCommand(input$83(key));
	}
	DECR(key) {
		return this.useCommand(input$82(key));
	}
	PSETEX(key, milliseconds, value) {
		return this.useCommand(input$81(key, milliseconds, value));
	}
	PEXPIRE(key, seconds, options) {
		return this.useCommand(input$80(key, seconds, options));
	}
	PTTL(key) {
		return this.useCommand(input$79(key));
	}
	TTL(key) {
		return this.useCommand(input$78(key));
	}
	EXPIRE(key, seconds, options) {
		return this.useCommand(input$77(key, seconds, options));
	}
	TYPE(key) {
		return this.useCommand(input$76(key));
	}
	KEYS(pattern) {
		return this.useCommand(input$75(pattern));
	}
	COPY(source, destination, options) {
		return this.useCommand(input$74(source, destination, options));
	}
	EXPIREAT(key, timestamp, options) {
		return this.useCommand(input$73(key, timestamp, options));
	}
	PEXPIREAT(key, timestamp, options) {
		return this.useCommand(input$72(key, timestamp, options));
	}
	PERSIST(key) {
		return this.useCommand(input$71(key));
	}
	EXPIRETIME(key) {
		return this.useCommand(input$70(key));
	}
	RENAME(key, newkey) {
		return this.useCommand(input$69(key, newkey));
	}
	RENAMENX(key, newkey) {
		return this.useCommand(input$68(key, newkey));
	}
	PEXPIRETIME(key) {
		return this.useCommand(input$67(key));
	}
	DEL(arg0, ...args_rest) {
		return this.useCommand(input$66(arg0, ...args_rest));
	}
	EXISTS(arg0, ...args_rest) {
		return this.useCommand(input$65(arg0, ...args_rest));
	}
	RPUSH(key, ...elements) {
		return this.useCommand(input$64(key, ...elements));
	}
	LPOP(key, count) {
		return this.useCommand(input$63(key, count));
	}
	RPOPLPUSH(source, destination) {
		return this.useCommand(input$62(source, destination));
	}
	RPUSHX(key, ...elements) {
		return this.useCommand(input$61(key, ...elements));
	}
	LSET(key, index, element) {
		return this.useCommand(input$60(key, index, element));
	}
	LREM(key, count, element) {
		return this.useCommand(input$59(key, count, element));
	}
	LPUSH(key, ...elements) {
		return this.useCommand(input$58(key, ...elements));
	}
	LPUSHX(key, ...elements) {
		return this.useCommand(input$57(key, ...elements));
	}
	RPOP(key, count) {
		return this.useCommand(input$56(key, count));
	}
	LRANGE(key, start, stop) {
		return this.useCommand(input$55(key, start, stop));
	}
	LLEN(key) {
		return this.useCommand(input$54(key));
	}
	LINSERT(key, element, options) {
		return this.useCommand(input$53(key, element, options));
	}
	LTRIM(key, start, stop) {
		return this.useCommand(input$52(key, start, stop));
	}
	LINDEX(key, index) {
		return this.useCommand(input$51(key, index));
	}
	XLEN(key) {
		return this.useCommand(input$50(key));
	}
	XDEL(key, ...ids) {
		return this.useCommand(input$49(key, ...ids));
	}
	XREAD(arg0, arg1, arg2) {
		return this.useCommand(input$48(arg0, arg1, arg2));
	}
	XADD(key, id, pairs, options) {
		return this.useCommand(input$47(key, id, pairs, options));
	}
	XRANGE(key, start, end, options) {
		return this.useCommand(input$46(key, start, end, options));
	}
	XREVRANGE(key, end, start, options) {
		return this.useCommand(input$45(key, end, start, options));
	}
	XTRIM(key, strategy, threshold, options) {
		return this.useCommand(input$44(key, strategy, threshold, options));
	}
	ZREMRANGEBYRANK(key, start, stop) {
		return this.useCommand(input$43(key, start, stop));
	}
	ZCARD(key) {
		return this.useCommand(input$42(key));
	}
	ZRANGEBYSCORE(key, min, max, options) {
		return this.useCommand(input$41(key, min, max, options));
	}
	ZREVRANGEBYLEX(key, max, min, options) {
		return this.useCommand(input$40(key, max, min, options));
	}
	ZREVRANGEBYSCORE(key, max, min, options) {
		return this.useCommand(input$39(key, max, min, options));
	}
	ZSCORE(key, member) {
		return this.useCommand(input$38(key, member));
	}
	ZCOUNT(key, min, max) {
		return this.useCommand(input$37(key, min, max));
	}
	ZADD(key, arg1, arg2, arg3) {
		return this.useCommand(input$36(key, arg1, arg2, arg3));
	}
	ZRANK(key, member, options) {
		return this.useCommand(input$35(key, member, options));
	}
	ZRANDMEMBER(key, count, options) {
		return this.useCommand(input$34(key, count, options));
	}
	ZREM(key, arg1, ...args_rest) {
		return this.useCommand(input$33(key, arg1, ...args_rest));
	}
	ZREMRANGEBYSCORE(key, min, max) {
		return this.useCommand(input$32(key, min, max));
	}
	ZREVRANK(key, member, options) {
		return this.useCommand(input$31(key, member, options));
	}
	ZRANGE(key, start, stop, options) {
		return this.useCommand(input$30(key, start, stop, options));
	}
	ZINCRBY(key, increment, member) {
		return this.useCommand(input$29(key, increment, member));
	}
	ZREMRANGEBYLEX(key, min, max) {
		return this.useCommand(input$28(key, min, max));
	}
	ZINTERSTORE(destination, arg1, options) {
		return this.useCommand(input$27(destination, arg1, options));
	}
	ZREVRANGE(key, start, stop, options) {
		return this.useCommand(input$26(key, start, stop, options));
	}
	ZRANGEBYLEX(key, min, max, options) {
		return this.useCommand(input$25(key, min, max, options));
	}
	HVALS(key) {
		return this.useCommand(input$24(key));
	}
	HSET(key, arg1, arg2) {
		return this.useCommand(input$23(key, arg1, arg2));
	}
	HINCRBYFLOAT(key, field, increment) {
		return this.useCommand(input$22(key, field, increment));
	}
	HGETALL(key) {
		return this.useCommand(input$21(key));
	}
	HGET(key, field) {
		return this.useCommand(input$20(key, field));
	}
	HPEXPIRE(key, milliseconds, fields, options) {
		return this.useCommand(input$19(key, milliseconds, fields, options));
	}
	HEXPIRE(key, seconds, fields, options) {
		return this.useCommand(input$18(key, seconds, fields, options));
	}
	HMSET(key, arg1, arg2) {
		return this.useCommand(input$17(key, arg1, arg2));
	}
	HMGET(key, ...fields) {
		return this.useCommand(input$16(key, ...fields));
	}
	HEXPIREAT(key, timestamp, fields, options) {
		return this.useCommand(input$15(key, timestamp, fields, options));
	}
	HRANDFIELD(key, count, options) {
		return this.useCommand(input$14(key, count, options));
	}
	HLEN(key) {
		return this.useCommand(input$13(key));
	}
	HKEYS(key) {
		return this.useCommand(input$12(key));
	}
	HINCRBY(key, field, increment) {
		return this.useCommand(input$11(key, field, increment));
	}
	HDEL(key, arg1, ...args_rest) {
		return this.useCommand(input$10(key, arg1, ...args_rest));
	}
	HSTRLEN(key, field) {
		return this.useCommand(input$9(key, field));
	}
	HPEXPIRETIME(key, fields) {
		return this.useCommand(input$8(key, fields));
	}
	HEXISTS(key, field) {
		return this.useCommand(input$7(key, field));
	}
	HPEXPIREAT(key, timestamp, fields, options) {
		return this.useCommand(input$6(key, timestamp, fields, options));
	}
	HSETNX(key, field, value) {
		return this.useCommand(input$5(key, field, value));
	}
	HEXPIRETIME(key, fields) {
		return this.useCommand(input$4(key, fields));
	}
	EVAL_RO(script, keys, args) {
		return this.useCommand(input$3(script, keys, args));
	}
	EVAL(script, keys, args) {
		return this.useCommand(input$2(script, keys, args));
	}
	EVALSHA(sha1, keys, args) {
		return this.useCommand(input$1(sha1, keys, args));
	}
	EVALSHA_RO(sha1, keys, args) {
		return this.useCommand(input(sha1, keys, args));
	}
};
//#endregion
//#region src/client.ts
var RedisXClient = class {
	redisClient;
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
	createScript(arg_0, arg_1, arg_2) {
		let options;
		if (typeof arg_0 === "string") {
			options = { code: arg_0 };
			if (Array.isArray(arg_1)) {
				options.keys = arg_1;
				if (typeof arg_2 === "function") options.outputValidator = arg_2;
			} else if (typeof arg_1 === "function") options.outputValidator = arg_1;
		} else options = arg_0;
		return new RedisXScript(this.redisClient, options);
	}
	SINTERCARD(keys, options) {
		return this.useCommand(input$119(keys, options));
	}
	SREM(key, arg1, ...args_rest) {
		return this.useCommand(input$118(key, arg1, ...args_rest));
	}
	SRANDMEMBER(key, count) {
		return this.useCommand(input$117(key, count));
	}
	SPOP(key, count) {
		return this.useCommand(input$116(key, count));
	}
	SINTERSTORE(destination, arg1, ...args_rest) {
		return this.useCommand(input$115(destination, arg1, ...args_rest));
	}
	SMISMEMBER(key, arg1, ...args_rest) {
		return this.useCommand(input$114(key, arg1, ...args_rest));
	}
	SINTER(arg0, ...args_rest) {
		return this.useCommand(input$113(arg0, ...args_rest));
	}
	SMEMBERS(key) {
		return this.useCommand(input$112(key));
	}
	SUNION(arg0, ...args_rest) {
		return this.useCommand(input$111(arg0, ...args_rest));
	}
	SISMEMBER(key, member) {
		return this.useCommand(input$110(key, member));
	}
	SUNIONSTORE(destination, arg1, ...args_rest) {
		return this.useCommand(input$109(destination, arg1, ...args_rest));
	}
	SMOVE(source, destination, member) {
		return this.useCommand(input$108(source, destination, member));
	}
	SDIFF(arg0, ...args_rest) {
		return this.useCommand(input$107(arg0, ...args_rest));
	}
	SUNIONCARD(keys, options) {
		return this.useCommand(input$106(keys, options));
	}
	SDIFFSTORE(destination, arg1, ...args_rest) {
		return this.useCommand(input$105(destination, arg1, ...args_rest));
	}
	SCARD(key) {
		return this.useCommand(input$104(key));
	}
	SDIFFCARD(keys, options) {
		return this.useCommand(input$103(keys, options));
	}
	SADD(key, arg1, ...args_rest) {
		return this.useCommand(input$102(key, arg1, ...args_rest));
	}
	MSETNX(pairs) {
		return this.useCommand(input$101(pairs));
	}
	SETNX(key, value) {
		return this.useCommand(input$100(key, value));
	}
	GET(key) {
		return this.useCommand(input$99(key));
	}
	SET(key, value, options) {
		return this.useCommand(input$98(key, value, options));
	}
	APPEND(key, value) {
		return this.useCommand(input$97(key, value));
	}
	INCR(key) {
		return this.useCommand(input$96(key));
	}
	INCRBYFLOAT(key, increment) {
		return this.useCommand(input$95(key, increment));
	}
	MGET(...args) {
		return this.useCommand(input$94(...args));
	}
	GETDEL(key) {
		return this.useCommand(input$93(key));
	}
	MSET(pairs) {
		return this.useCommand(input$92(pairs));
	}
	INCRBY(key, increment) {
		return this.useCommand(input$91(key, increment));
	}
	SETRANGE(key, offset, value) {
		return this.useCommand(input$90(key, offset, value));
	}
	SUBSTR(key, start, end) {
		return this.useCommand(input$89(key, start, end));
	}
	GETSET(key, value) {
		return this.useCommand(input$88(key, value));
	}
	DECRBY(key, decrement) {
		return this.useCommand(input$87(key, decrement));
	}
	GETRANGE(key, start, end) {
		return this.useCommand(input$86(key, start, end));
	}
	SETEX(key, seconds, value) {
		return this.useCommand(input$85(key, seconds, value));
	}
	GETEX(key, options) {
		return this.useCommand(input$84(key, options));
	}
	STRLEN(key) {
		return this.useCommand(input$83(key));
	}
	DECR(key) {
		return this.useCommand(input$82(key));
	}
	PSETEX(key, milliseconds, value) {
		return this.useCommand(input$81(key, milliseconds, value));
	}
	PEXPIRE(key, seconds, options) {
		return this.useCommand(input$80(key, seconds, options));
	}
	PTTL(key) {
		return this.useCommand(input$79(key));
	}
	TTL(key) {
		return this.useCommand(input$78(key));
	}
	EXPIRE(key, seconds, options) {
		return this.useCommand(input$77(key, seconds, options));
	}
	TYPE(key) {
		return this.useCommand(input$76(key));
	}
	KEYS(pattern) {
		return this.useCommand(input$75(pattern));
	}
	COPY(source, destination, options) {
		return this.useCommand(input$74(source, destination, options));
	}
	EXPIREAT(key, timestamp, options) {
		return this.useCommand(input$73(key, timestamp, options));
	}
	PEXPIREAT(key, timestamp, options) {
		return this.useCommand(input$72(key, timestamp, options));
	}
	PERSIST(key) {
		return this.useCommand(input$71(key));
	}
	EXPIRETIME(key) {
		return this.useCommand(input$70(key));
	}
	RENAME(key, newkey) {
		return this.useCommand(input$69(key, newkey));
	}
	RENAMENX(key, newkey) {
		return this.useCommand(input$68(key, newkey));
	}
	PEXPIRETIME(key) {
		return this.useCommand(input$67(key));
	}
	DEL(arg0, ...args_rest) {
		return this.useCommand(input$66(arg0, ...args_rest));
	}
	EXISTS(arg0, ...args_rest) {
		return this.useCommand(input$65(arg0, ...args_rest));
	}
	RPUSH(key, ...elements) {
		return this.useCommand(input$64(key, ...elements));
	}
	LPOP(key, count) {
		return this.useCommand(input$63(key, count));
	}
	RPOPLPUSH(source, destination) {
		return this.useCommand(input$62(source, destination));
	}
	RPUSHX(key, ...elements) {
		return this.useCommand(input$61(key, ...elements));
	}
	LSET(key, index, element) {
		return this.useCommand(input$60(key, index, element));
	}
	LREM(key, count, element) {
		return this.useCommand(input$59(key, count, element));
	}
	LPUSH(key, ...elements) {
		return this.useCommand(input$58(key, ...elements));
	}
	LPUSHX(key, ...elements) {
		return this.useCommand(input$57(key, ...elements));
	}
	RPOP(key, count) {
		return this.useCommand(input$56(key, count));
	}
	LRANGE(key, start, stop) {
		return this.useCommand(input$55(key, start, stop));
	}
	LLEN(key) {
		return this.useCommand(input$54(key));
	}
	LINSERT(key, element, options) {
		return this.useCommand(input$53(key, element, options));
	}
	LTRIM(key, start, stop) {
		return this.useCommand(input$52(key, start, stop));
	}
	LINDEX(key, index) {
		return this.useCommand(input$51(key, index));
	}
	XLEN(key) {
		return this.useCommand(input$50(key));
	}
	XDEL(key, ...ids) {
		return this.useCommand(input$49(key, ...ids));
	}
	XREAD(arg0, arg1, arg2) {
		return this.useCommand(input$48(arg0, arg1, arg2));
	}
	XADD(key, id, pairs, options) {
		return this.useCommand(input$47(key, id, pairs, options));
	}
	XRANGE(key, start, end, options) {
		return this.useCommand(input$46(key, start, end, options));
	}
	XREVRANGE(key, end, start, options) {
		return this.useCommand(input$45(key, end, start, options));
	}
	XTRIM(key, strategy, threshold, options) {
		return this.useCommand(input$44(key, strategy, threshold, options));
	}
	ZREMRANGEBYRANK(key, start, stop) {
		return this.useCommand(input$43(key, start, stop));
	}
	ZCARD(key) {
		return this.useCommand(input$42(key));
	}
	ZRANGEBYSCORE(key, min, max, options) {
		return this.useCommand(input$41(key, min, max, options));
	}
	ZREVRANGEBYLEX(key, max, min, options) {
		return this.useCommand(input$40(key, max, min, options));
	}
	ZREVRANGEBYSCORE(key, max, min, options) {
		return this.useCommand(input$39(key, max, min, options));
	}
	ZSCORE(key, member) {
		return this.useCommand(input$38(key, member));
	}
	ZCOUNT(key, min, max) {
		return this.useCommand(input$37(key, min, max));
	}
	ZADD(key, arg1, arg2, arg3) {
		return this.useCommand(input$36(key, arg1, arg2, arg3));
	}
	ZRANK(key, member, options) {
		return this.useCommand(input$35(key, member, options));
	}
	ZRANDMEMBER(key, count, options) {
		return this.useCommand(input$34(key, count, options));
	}
	ZREM(key, arg1, ...args_rest) {
		return this.useCommand(input$33(key, arg1, ...args_rest));
	}
	ZREMRANGEBYSCORE(key, min, max) {
		return this.useCommand(input$32(key, min, max));
	}
	ZREVRANK(key, member, options) {
		return this.useCommand(input$31(key, member, options));
	}
	ZRANGE(key, start, stop, options) {
		return this.useCommand(input$30(key, start, stop, options));
	}
	ZINCRBY(key, increment, member) {
		return this.useCommand(input$29(key, increment, member));
	}
	ZREMRANGEBYLEX(key, min, max) {
		return this.useCommand(input$28(key, min, max));
	}
	ZINTERSTORE(destination, arg1, options) {
		return this.useCommand(input$27(destination, arg1, options));
	}
	ZREVRANGE(key, start, stop, options) {
		return this.useCommand(input$26(key, start, stop, options));
	}
	ZRANGEBYLEX(key, min, max, options) {
		return this.useCommand(input$25(key, min, max, options));
	}
	HVALS(key) {
		return this.useCommand(input$24(key));
	}
	HSET(key, arg1, arg2) {
		return this.useCommand(input$23(key, arg1, arg2));
	}
	HINCRBYFLOAT(key, field, increment) {
		return this.useCommand(input$22(key, field, increment));
	}
	HGETALL(key) {
		return this.useCommand(input$21(key));
	}
	HGET(key, field) {
		return this.useCommand(input$20(key, field));
	}
	HPEXPIRE(key, milliseconds, fields, options) {
		return this.useCommand(input$19(key, milliseconds, fields, options));
	}
	HEXPIRE(key, seconds, fields, options) {
		return this.useCommand(input$18(key, seconds, fields, options));
	}
	HMSET(key, arg1, arg2) {
		return this.useCommand(input$17(key, arg1, arg2));
	}
	HMGET(key, ...fields) {
		return this.useCommand(input$16(key, ...fields));
	}
	HEXPIREAT(key, timestamp, fields, options) {
		return this.useCommand(input$15(key, timestamp, fields, options));
	}
	HRANDFIELD(key, count, options) {
		return this.useCommand(input$14(key, count, options));
	}
	HLEN(key) {
		return this.useCommand(input$13(key));
	}
	HKEYS(key) {
		return this.useCommand(input$12(key));
	}
	HINCRBY(key, field, increment) {
		return this.useCommand(input$11(key, field, increment));
	}
	HDEL(key, arg1, ...args_rest) {
		return this.useCommand(input$10(key, arg1, ...args_rest));
	}
	HSTRLEN(key, field) {
		return this.useCommand(input$9(key, field));
	}
	HPEXPIRETIME(key, fields) {
		return this.useCommand(input$8(key, fields));
	}
	HEXISTS(key, field) {
		return this.useCommand(input$7(key, field));
	}
	HPEXPIREAT(key, timestamp, fields, options) {
		return this.useCommand(input$6(key, timestamp, fields, options));
	}
	HSETNX(key, field, value) {
		return this.useCommand(input$5(key, field, value));
	}
	HEXPIRETIME(key, fields) {
		return this.useCommand(input$4(key, fields));
	}
	EVAL_RO(script, keys, args) {
		return this.useCommand(input$3(script, keys, args));
	}
	EVAL(script, keys, args) {
		return this.useCommand(input$2(script, keys, args));
	}
	EVALSHA(sha1, keys, args) {
		return this.useCommand(input$1(sha1, keys, args));
	}
	EVALSHA_RO(sha1, keys, args) {
		return this.useCommand(input(sha1, keys, args));
	}
};
//#endregion
exports.RedisXClient = RedisXClient;
exports.stringBulkToObject = stringBulkToObject;
