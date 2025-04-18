import { RedisXTransaction } from './transaction.js';
export class RedisXClient {
    redisClient;
    // eslint-disable-next-line no-useless-constructor, no-empty-function
    constructor(redisClient) {
        this.redisClient = redisClient;
    }
    async sendCommand(command, ...args) {
        return await this.redisClient.sendCommand([
            command,
            ...args.map(String),
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
        return this.useCommand(input_get(key));
    }
    SET(key, value, options) {
        return this.useCommand(input_set(key, value, options));
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
        return this.useCommand(input_expire(key, seconds, options));
    }
    /**
     * Returns all keys matching pattern.
     * - Available since: 1.0.0.
     * - Time complexity: O(N) with N being the number of keys in the database.
     * @param pattern Pattern to match.
     * @returns A set of keys matching pattern.
     */
    KEYS(pattern) {
        return this.useCommand(input_keys(pattern));
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
        return this.useCommand(input_del(...keys));
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
        return this.useCommand(input_lpush(key, ...elements));
    }
    /**
     * Returns the sorted set cardinality (number of elements) of the sorted set stored at key.
     * - Available since: 1.2.0.
     * - Time complexity: O(1).
     * @param key Key holds a sorted set.
     * @returns The cardinality (number of members) of the sorted set, or 0 if the key doesn't exist.
     */
    ZCARD(key) {
        return this.useCommand(input_zcard(key));
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
        return this.useCommand(input_zscore(key, member));
    }
    ZADD(key, arg1, arg2, arg3) {
        return this.useCommand(input_zadd(key, arg1, arg2, arg3));
    }
    ZREM(key, arg1, ...args_rest) {
        return this.useCommand(input_zrem(key, arg1, ...args_rest));
    }
    ZRANGE(key, start, stop, options) {
        return this.useCommand(input_zrange(key, start, stop, options));
    }
    ZINTERSTORE(destination, arg1, options) {
        return this.useCommand(input_zinterstore(destination, arg1, options));
    }
    HSET(key, arg1, arg2) {
        return this.useCommand(input_hset(key, arg1, arg2));
    }
    /**
     * Returns all fields and values of the hash stored at key.
     * - Available since: 2.0.0.
     * - Time complexity: O(N) where N is the size of the hash.
     * @param key -
     * @returns A record of fields and their values stored in the hash.
     */
    HGETALL(key) {
        return this.useCommand(input_hgetall(key));
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
        return this.useCommand(input_eval(script, keys, args));
    }
}
// MARK: imports
import { input as input_get, } from './commands/string/get.js';
import { input as input_set, } from './commands/string/set.js';
import { input as input_expire, } from './commands/generic/expire.js';
import { input as input_keys, } from './commands/generic/keys.js';
import { input as input_del, } from './commands/generic/del.js';
import { input as input_lpush, } from './commands/list/lpush.js';
import { input as input_zcard, } from './commands/sorted-set/zcard.js';
import { input as input_zscore, } from './commands/sorted-set/zscore.js';
import { input as input_zadd, } from './commands/sorted-set/zadd.js';
import { input as input_zrem, } from './commands/sorted-set/zrem.js';
import { input as input_zrange, } from './commands/sorted-set/zrange.js';
import { input as input_zinterstore, } from './commands/sorted-set/zinterstore.js';
import { input as input_hset, } from './commands/hash/hset.js';
import { input as input_hgetall, } from './commands/hash/hgetall.js';
import { input as input_eval, } from './commands/scripting/eval.js';
// MARK: end imports
