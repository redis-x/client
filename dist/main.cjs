"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// dist/esm/main.js
var main_exports = {};
__export(main_exports, {
  RedisXClient: () => RedisXClient
});
module.exports = __toCommonJS(main_exports);

// dist/esm/utils.js
function isPlainObject(value) {
  return typeof value === "object" && value !== null && Array.isArray(value) !== true && value.constructor === Object && Object.getPrototypeOf(value) === Object.prototype;
}
function stringBulkToObject(values) {
  const object = {};
  for (let index = 0; index < values.length; index += 2) {
    object[values[index]] = values[index + 1];
  }
  return object;
}

// dist/esm/transaction/command.js
var RedisXTransactionCommand = class {
  index;
  _type;
  // Dummy private property
  // eslint-disable-next-line no-useless-constructor, no-empty-function
  constructor(index) {
    this.index = index;
  }
};
function unwrapRedisTransactionCommand(target, result) {
  if (target instanceof RedisXTransactionCommand) {
    return result[target.index];
  }
  if (Array.isArray(target)) {
    for (const [index, value] of target.entries()) {
      target[index] = unwrapRedisTransactionCommand(value, result);
    }
  } else if (isPlainObject(target)) {
    for (const [key, value] of Object.entries(target)) {
      target[key] = unwrapRedisTransactionCommand(value, result);
    }
  }
  return target;
}

// dist/esm/commands/string/get.js
function input(key) {
  return {
    kind: "#schema",
    args: [
      "GET",
      key
    ]
  };
}

// dist/esm/commands/string/set.js
function input2(key, value, options) {
  const args_options = [];
  if (options) {
    if (options.NX) {
      args_options.push("NX");
    }
    if (options.XX) {
      args_options.push("XX");
    }
    if (options.EX) {
      args_options.push("EX", String(options.EX));
    }
    if (options.PX) {
      args_options.push("PX", String(options.PX));
    }
    if (options.EXAT) {
      args_options.push("EXAT", String(options.EXAT));
    }
    if (options.PXAT) {
      args_options.push("PXAT", String(options.PXAT));
    }
    if (options.KEEPTTL) {
      args_options.push("KEEPTTL");
    }
    if (options.GET) {
      args_options.push("GET");
    }
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

// dist/esm/commands/generic/expire.js
function input3(key, seconds, options) {
  const args_options = [];
  if (options) {
    if (options.NX) {
      args_options.push("NX");
    }
    if (options.XX) {
      args_options.push("XX");
    }
    if (options.GT) {
      args_options.push("GT");
    }
    if (options.LT) {
      args_options.push("LT");
    }
  }
  return {
    kind: "#schema",
    args: [
      "EXPIRE",
      key,
      String(seconds),
      ...args_options
    ]
  };
}

// dist/esm/commands/generic/keys.js
function input4(pattern) {
  return {
    kind: "#schema",
    args: [
      "KEYS",
      pattern
    ],
    replyTransform
  };
}
function replyTransform(result) {
  return new Set(result);
}

// dist/esm/commands/generic/del.js
function input5(...keys) {
  return {
    kind: "#schema",
    args: [
      "DEL",
      ...keys
    ]
  };
}

// dist/esm/commands/list/lpush.js
function input6(key, ...elements) {
  return {
    kind: "#schema",
    args: [
      "LPUSH",
      key,
      ...elements.map(String)
    ]
  };
}

// dist/esm/commands/sorted-set/zcard.js
function input7(key) {
  return {
    kind: "#schema",
    args: [
      "ZCARD",
      key
    ]
  };
}

// dist/esm/commands/sorted-set/zscore.js
function input8(key, member) {
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

// dist/esm/commands/sorted-set/zadd.js
function input9(key, arg1, arg2, arg3) {
  const args = [
    "ZADD",
    key
  ];
  const pairs = [];
  if (typeof arg1 === "number") {
    pairs.push(String(arg1), arg2);
  } else {
    for (const [member, score] of Object.entries(arg1)) {
      pairs.push(String(score), member);
    }
  }
  const options = typeof arg2 === "string" || typeof arg2 === "number" ? arg3 : arg2;
  if (options) {
    if (options.NX) {
      args.push("NX");
    }
    if (options.XX) {
      args.push("XX");
    }
    if (options.GT) {
      args.push("GT");
    }
    if (options.LT) {
      args.push("LT");
    }
    if (options.CH) {
      args.push("CH");
    }
    if (options.INCR) {
      args.push("INCR");
    }
  }
  args.push(...pairs);
  return {
    kind: "#schema",
    args,
    replyTransform(result) {
      if (typeof result === "string") {
        return Number.parseFloat(result);
      }
      return result;
    }
  };
}

// dist/esm/commands/sorted-set/zrem.js
function input10(key, arg1, ...args_rest) {
  const args = [
    "ZREM",
    key
  ];
  if (typeof arg1 === "string" || typeof arg1 === "number") {
    args.push(String(arg1), ...args_rest.map(String));
  } else {
    args.push(...[...arg1].map(String));
  }
  return {
    kind: "#schema",
    args
  };
}

// dist/esm/commands/sorted-set/zrange.js
function input11(key, start, stop, options) {
  const args = [
    "ZRANGE",
    key,
    String(start),
    String(stop)
  ];
  if (options) {
    if (options.BY) {
      args.push(`BY${options.BY}`);
    }
    if (options.REV) {
      args.push("REV");
    }
    if (options.LIMIT) {
      args.push("LIMIT", String(options.LIMIT[0]), String(options.LIMIT[1]));
    }
    if (options.WITHSCORES) {
      args.push("WITHSCORES");
    }
  }
  return {
    kind: "#schema",
    args,
    replyTransform(result) {
      if (options?.WITHSCORES) {
        const transformed_result = [];
        for (let index = 0; index < result.length; index += 2) {
          transformed_result.push({
            member: result[index],
            score: Number(result[index + 1])
          });
        }
        return transformed_result;
      }
      return result;
    }
  };
}

// dist/esm/commands/sorted-set/zinterstore.js
function input12(destination, arg1, options) {
  const args = [
    "ZINTERSTORE",
    destination
  ];
  if (Array.isArray(arg1)) {
    args.push(String(arg1.length), ...arg1.map(String));
  } else {
    const entries = Object.entries(arg1);
    args.push(String(entries.length));
    const weights = [];
    for (const [key, weight] of entries) {
      args.push(key);
      weights.push(String(weight));
    }
    args.push("WEIGHTS", ...weights);
  }
  if (options?.AGGREGATE) {
    args.push("AGGREGATE", options.AGGREGATE);
  }
  return {
    kind: "#schema",
    args
  };
}

// dist/esm/commands/hash/hset.js
function input13(key, arg1, arg2) {
  const pairs = [];
  if (typeof arg1 === "string") {
    pairs.push(arg1, String(arg2));
  } else {
    for (const [field, value] of Object.entries(arg1)) {
      pairs.push(field, String(value));
    }
  }
  return {
    kind: "#schema",
    args: [
      "HSET",
      key,
      ...pairs
    ]
  };
}

// dist/esm/commands/hash/hgetall.js
function input14(key) {
  return {
    kind: "#schema",
    args: [
      "HGETALL",
      key
    ],
    replyTransform: stringBulkToObject
  };
}

// dist/esm/commands/scripting/eval.js
function input15(script, keys, args) {
  const command_args = [
    "EVAL",
    script,
    String(keys.length),
    ...keys.map(String)
  ];
  if (args) {
    command_args.push(...args.map(String));
  }
  return {
    kind: "#schema",
    args: command_args
  };
}

// dist/esm/transaction/use.js
var RedisXTransactionUse = class {
  transaction;
  queue = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, no-empty-function, no-useless-constructor
  constructor(transaction) {
    this.transaction = transaction;
  }
  addCommand(command, ...args) {
    return this.useCommand({
      kind: "#schema",
      args: [
        command,
        ...args.map(String)
      ]
    });
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useCommand(command) {
    const redis_transaction_command = new RedisXTransactionCommand(-1);
    this.queue.push({
      command,
      redis_transaction_command
    });
    return redis_transaction_command;
  }
  // MARK: commands
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
  GET(key) {
    return this.useCommand(input(key));
  }
  SET(key, value, options) {
    return this.useCommand(input2(key, value, options));
  }
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
  EXPIRE(key, seconds, options) {
    return this.useCommand(input3(key, seconds, options));
  }
  /**
   * Returns all keys matching pattern.
   * - Available since: 1.0.0.
   * - Time complexity: O(N) with N being the number of keys in the database.
   * @param pattern Pattern to match.
   * @returns A set of keys matching pattern.
   */
  KEYS(pattern) {
    return this.useCommand(input4(pattern));
  }
  /**
   * Removes the specified keys.
   *
   * A key is ignored if it does not exist.
   * - Available since: 1.0.0.
   * - Time complexity: O(N) where N is the number of keys that will be removed. When a key to remove holds a value other than a string, the individual complexity for this key is O(M) where M is the number of elements in the list, set, sorted set or hash.
   * @param keys Keys to delete.
   * @returns The number of keys that were removed.
   */
  DEL(...keys) {
    return this.useCommand(input5(...keys));
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
   */
  LPUSH(key, ...elements) {
    return this.useCommand(input6(key, ...elements));
  }
  /**
   * Returns the sorted set cardinality (number of elements) of the sorted set stored at key.
   * - Available since: 1.2.0.
   * - Time complexity: O(1).
   * @param key Key holds a sorted set.
   * @returns The cardinality (number of members) of the sorted set, or 0 if the key doesn't exist.
   */
  ZCARD(key) {
    return this.useCommand(input7(key));
  }
  /**
   * Returns the score of member in the sorted set at key.
   * - Available since: 1.0.0.
   * - Time complexity: O(1).
   * @param key Key holds a sorted set.
   * @param member Member in the sorted set.
   * @returns The score of the member (a double-precision floating point number), represented as a string, or `null` if member does not exist in the sorted set, or the key does not exist.
   */
  ZSCORE(key, member) {
    return this.useCommand(input8(key, member));
  }
  ZADD(key, arg1, arg2, arg3) {
    return this.useCommand(input9(key, arg1, arg2, arg3));
  }
  ZREM(key, arg1, ...args_rest) {
    return this.useCommand(input10(key, arg1, ...args_rest));
  }
  ZRANGE(key, start, stop, options) {
    return this.useCommand(input11(key, start, stop, options));
  }
  ZINTERSTORE(destination, arg1, options) {
    return this.useCommand(input12(destination, arg1, options));
  }
  HSET(key, arg1, arg2) {
    return this.useCommand(input13(key, arg1, arg2));
  }
  /**
   * Returns all fields and values of the hash stored at key.
   * - Available since: 2.0.0.
   * - Time complexity: O(N) where N is the size of the hash.
   * @param key -
   * @returns A record of fields and their values stored in the hash.
   */
  HGETALL(key) {
    return this.useCommand(input14(key));
  }
  /**
   * Invoke the execution of a server-side Lua script.
   * - Available since: 2.6.0.
   * - Time complexity: Depends on the script that is executed.
   * @param script Script's source code.
   * @param keys Keys accessed by the script.
   * @param args Arguments passed to the script.
   * @returns Value returned by the script.
   */
  EVAL(script, keys, args) {
    return this.useCommand(input15(script, keys, args));
  }
};

// dist/esm/transaction.js
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
      this.multi.addCommand([
        command,
        ...args.map(String)
      ]);
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
    if (command.replyTransform) {
      this.transformers[this.queue_length - 1] = command.replyTransform;
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    for (const [index, transformer] of this.transformers.entries()) {
      if (transformer) {
        result[index] = transformer(result[index]);
      }
    }
    const result_named = unwrapRedisTransactionCommand(this.data, result);
    if (this.return_no_array) {
      return result_named;
    }
    return Object.assign(result, result_named);
  }
  // MARK: commands
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
  GET(key) {
    return this.useCommand(input(key));
  }
  SET(key, value, options) {
    return this.useCommand(input2(key, value, options));
  }
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
  EXPIRE(key, seconds, options) {
    return this.useCommand(input3(key, seconds, options));
  }
  /**
   * Returns all keys matching pattern.
   * - Available since: 1.0.0.
   * - Time complexity: O(N) with N being the number of keys in the database.
   * @param pattern Pattern to match.
   * @returns A set of keys matching pattern.
   */
  KEYS(pattern) {
    return this.useCommand(input4(pattern));
  }
  /**
   * Removes the specified keys.
   *
   * A key is ignored if it does not exist.
   * - Available since: 1.0.0.
   * - Time complexity: O(N) where N is the number of keys that will be removed. When a key to remove holds a value other than a string, the individual complexity for this key is O(M) where M is the number of elements in the list, set, sorted set or hash.
   * @param keys Keys to delete.
   * @returns The number of keys that were removed.
   */
  DEL(...keys) {
    return this.useCommand(input5(...keys));
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
   */
  LPUSH(key, ...elements) {
    return this.useCommand(input6(key, ...elements));
  }
  /**
   * Returns the sorted set cardinality (number of elements) of the sorted set stored at key.
   * - Available since: 1.2.0.
   * - Time complexity: O(1).
   * @param key Key holds a sorted set.
   * @returns The cardinality (number of members) of the sorted set, or 0 if the key doesn't exist.
   */
  ZCARD(key) {
    return this.useCommand(input7(key));
  }
  /**
   * Returns the score of member in the sorted set at key.
   * - Available since: 1.0.0.
   * - Time complexity: O(1).
   * @param key Key holds a sorted set.
   * @param member Member in the sorted set.
   * @returns The score of the member (a double-precision floating point number), represented as a string, or `null` if member does not exist in the sorted set, or the key does not exist.
   */
  ZSCORE(key, member) {
    return this.useCommand(input8(key, member));
  }
  ZADD(key, arg1, arg2, arg3) {
    return this.useCommand(input9(key, arg1, arg2, arg3));
  }
  ZREM(key, arg1, ...args_rest) {
    return this.useCommand(input10(key, arg1, ...args_rest));
  }
  ZRANGE(key, start, stop, options) {
    return this.useCommand(input11(key, start, stop, options));
  }
  ZINTERSTORE(destination, arg1, options) {
    return this.useCommand(input12(destination, arg1, options));
  }
  HSET(key, arg1, arg2) {
    return this.useCommand(input13(key, arg1, arg2));
  }
  /**
   * Returns all fields and values of the hash stored at key.
   * - Available since: 2.0.0.
   * - Time complexity: O(N) where N is the size of the hash.
   * @param key -
   * @returns A record of fields and their values stored in the hash.
   */
  HGETALL(key) {
    return this.useCommand(input14(key));
  }
  /**
   * Invoke the execution of a server-side Lua script.
   * - Available since: 2.6.0.
   * - Time complexity: Depends on the script that is executed.
   * @param script Script's source code.
   * @param keys Keys accessed by the script.
   * @param args Arguments passed to the script.
   * @returns Value returned by the script.
   */
  EVAL(script, keys, args) {
    return this.useCommand(input15(script, keys, args));
  }
};

// dist/esm/client.js
var RedisXClient = class {
  redisClient;
  // eslint-disable-next-line no-useless-constructor, no-empty-function
  constructor(redisClient) {
    this.redisClient = redisClient;
  }
  async sendCommand(command, ...args) {
    return await this.redisClient.sendCommand([
      command,
      ...args.map(String)
    ]);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async useCommand(command) {
    const result = await this.redisClient.sendCommand(command.args);
    if (command.replyTransform) {
      return command.replyTransform(result);
    }
    return result;
  }
  createTransaction() {
    return new RedisXTransaction(this.redisClient);
  }
  // MARK: commands
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
  GET(key) {
    return this.useCommand(input(key));
  }
  SET(key, value, options) {
    return this.useCommand(input2(key, value, options));
  }
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
  EXPIRE(key, seconds, options) {
    return this.useCommand(input3(key, seconds, options));
  }
  /**
   * Returns all keys matching pattern.
   * - Available since: 1.0.0.
   * - Time complexity: O(N) with N being the number of keys in the database.
   * @param pattern Pattern to match.
   * @returns A set of keys matching pattern.
   */
  KEYS(pattern) {
    return this.useCommand(input4(pattern));
  }
  /**
   * Removes the specified keys.
   *
   * A key is ignored if it does not exist.
   * - Available since: 1.0.0.
   * - Time complexity: O(N) where N is the number of keys that will be removed. When a key to remove holds a value other than a string, the individual complexity for this key is O(M) where M is the number of elements in the list, set, sorted set or hash.
   * @param keys Keys to delete.
   * @returns The number of keys that were removed.
   */
  DEL(...keys) {
    return this.useCommand(input5(...keys));
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
   */
  LPUSH(key, ...elements) {
    return this.useCommand(input6(key, ...elements));
  }
  /**
   * Returns the sorted set cardinality (number of elements) of the sorted set stored at key.
   * - Available since: 1.2.0.
   * - Time complexity: O(1).
   * @param key Key holds a sorted set.
   * @returns The cardinality (number of members) of the sorted set, or 0 if the key doesn't exist.
   */
  ZCARD(key) {
    return this.useCommand(input7(key));
  }
  /**
   * Returns the score of member in the sorted set at key.
   * - Available since: 1.0.0.
   * - Time complexity: O(1).
   * @param key Key holds a sorted set.
   * @param member Member in the sorted set.
   * @returns The score of the member (a double-precision floating point number), represented as a string, or `null` if member does not exist in the sorted set, or the key does not exist.
   */
  ZSCORE(key, member) {
    return this.useCommand(input8(key, member));
  }
  ZADD(key, arg1, arg2, arg3) {
    return this.useCommand(input9(key, arg1, arg2, arg3));
  }
  ZREM(key, arg1, ...args_rest) {
    return this.useCommand(input10(key, arg1, ...args_rest));
  }
  ZRANGE(key, start, stop, options) {
    return this.useCommand(input11(key, start, stop, options));
  }
  ZINTERSTORE(destination, arg1, options) {
    return this.useCommand(input12(destination, arg1, options));
  }
  HSET(key, arg1, arg2) {
    return this.useCommand(input13(key, arg1, arg2));
  }
  /**
   * Returns all fields and values of the hash stored at key.
   * - Available since: 2.0.0.
   * - Time complexity: O(N) where N is the size of the hash.
   * @param key -
   * @returns A record of fields and their values stored in the hash.
   */
  HGETALL(key) {
    return this.useCommand(input14(key));
  }
  /**
   * Invoke the execution of a server-side Lua script.
   * - Available since: 2.6.0.
   * - Time complexity: Depends on the script that is executed.
   * @param script Script's source code.
   * @param keys Keys accessed by the script.
   * @param args Arguments passed to the script.
   * @returns Value returned by the script.
   */
  EVAL(script, keys, args) {
    return this.useCommand(input15(script, keys, args));
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  RedisXClient
});
