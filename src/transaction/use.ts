import { type RedisXTransaction } from '../transaction.js';
import { Command } from '../types.js';
import { RedisXTransactionCommand } from './command.js';

export class RedisXTransactionUse {
	queue: {
		command: Command,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		redis_transaction_command: RedisXTransactionCommand<any>,
	}[] = [];

	// eslint-disable-next-line @typescript-eslint/no-explicit-any, no-empty-function, no-useless-constructor
	constructor(private transaction: RedisXTransaction<any, any, any>) {}

	addCommand(
		command: string,
		...args: (string | number)[]
	): RedisXTransactionCommand<unknown> {
		return this.useCommand({
			kind: '#schema',
			args: [
				command,
				...args.map(String),
			],
		});
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private useCommand(command: Command): RedisXTransactionCommand<any> {
		const redis_transaction_command = new RedisXTransactionCommand(-1);

		this.queue.push({
			command,
			redis_transaction_command,
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
	GET(key: string): RedisXTransactionCommand<string | null> {
		return this.useCommand(input_get(key));
	}

	/**
	 * Set the string value of a key.
	 * - Available since: 1.0.0.
	 * - Time complexity: O(1).
	 * @param key Key to set.
	 * @param value Value to set.
	 * @returns Returns string `"OK"` if the key was set, or `null` if operation was aborted (conflict with one of the XX/NX options).
	 */
	SET(key: string, value: string | number): RedisXTransactionCommand<'OK' | null>;
	/**
	 * Set the string value of a key.
	 * - Available since: 1.0.0.
	 * - Time complexity: O(1).
	 * @param key Key to set.
	 * @param value Value to set.
	 * @param options Comand options.
	 * @returns Returns string `"OK"` if the key was set, or `null` if operation was aborted (conflict with one of the XX/NX options).
	 */
	SET(key: string, value: string | number, options: Omit<SetOptions, 'GET'>): RedisXTransactionCommand<'OK' | null>;
	/**
	 * Set the string value of a key.
	 * - Available since: 1.0.0.
	 * - Time complexity: O(1).
	 * @param key Key to set.
	 * @param value Value to set.
	 * @param options Comand options.
	 * @returns Returns string with the previous value of the key, or `null` if the key didn't exist before the SET.
	 */
	SET(key: string, value: string | number, options: SetOptions): RedisXTransactionCommand<string | null>;

	SET(key: string, value: string | number, options?: SetOptions) {
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
	EXPIRE(key: string, seconds: number, options?: ExpireOptions): RedisXTransactionCommand<0 | 1> {
		return this.useCommand(input_expire(key, seconds, options));
	}

	/**
	 * Returns all keys matching pattern.
	 * - Available since: 1.0.0.
	 * - Time complexity: O(N) with N being the number of keys in the database.
	 * @param pattern Pattern to match.
	 * @returns A set of keys matching pattern.
	 */
	KEYS(pattern: string): RedisXTransactionCommand<Set<string>> {
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
	DEL(...keys: string[]): RedisXTransactionCommand<number> {
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
	LPUSH(
		key: string,
		...elements: (string | number)[]
	): RedisXTransactionCommand<number> {
		return this.useCommand(input_lpush(key, ...elements));
	}

	/**
	 * Returns the sorted set cardinality (number of elements) of the sorted set stored at key.
	 * - Available since: 1.2.0.
	 * - Time complexity: O(1).
	 * @param key Key holds a sorted set.
	 * @returns The cardinality (number of members) of the sorted set, or 0 if the key doesn't exist.
	 */
	ZCARD(key: string): RedisXTransactionCommand<number> {
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
	ZSCORE(key: string, member: string | number): RedisXTransactionCommand<number | null> {
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
	 */
	ZADD(
		key: string,
		score: number,
		member: string | number,
		options?: ZaddOptions,
	): RedisXTransactionCommand<number>;
	/**
	 * Adds all the specified members with the specified scores to the sorted set stored at key.
	 * - Available since: 1.2.0
	 * - Multiple score/member pairs are available since Redis 2.4.0.
	 * - Time complexity: O(log(N)) for each item added, where N is the number of elements in the sorted set.
	 * @param key - Key holds a sorted set.
	 * @param pairs - Object containing score/member pairs to set.
	 * @param options -
	 * @returns The number of fields that were added.
	 */
	ZADD(
		key: string,
		pairs: Record<string, number>,
		options?: Omit<ZaddOptions, 'INCR'>,
	): RedisXTransactionCommand<number>;

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
	 */
	ZREM(
		key: string,
		...members: (string | number)[]
	): RedisXTransactionCommand<number>;
	/**
	 * Removes the specified members from the sorted set stored at key. Non existing members are ignored.
	 * - Available since: 1.2.0
	 * - Time complexity: O(M*log(N)) with N being the number of elements in the sorted set and M the number of elements to be removed.
	 * @param key Key holds a sorted set.
	 * @param members Members to remove.
	 * @returns The number of members removed from the sorted set, not including non-existing members.
	 */
	ZREM(
		key: string,
		members: (string | number)[] | Set<string> | IterableIterator<string>,
	): RedisXTransactionCommand<number>;

	ZREM(
		key: string,
		arg1: string | number | (string | number)[] | Set<string> | IterableIterator<string>,
		...args_rest: (string | number)[]
	): RedisXTransactionCommand<number> {
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
	 */
	ZRANGE(
		key: string,
		start: string | number,
		stop: string | number,
		options?: Omit<ZrangeOptions, 'WITHSCORES'>,
	): RedisXTransactionCommand<string[]>;
	/**
	 * Returns the specified range of elements in the sorted set stored at key.
	 * - Available since: 1.2.0
	 * - Time complexity: O(log(N)+M) with N being the number of elements in the sorted set and M the number of elements returned.
	 * @param key - Key that contains the hash.
	 * @param start - Start index by default, minimum score if BY is `SCORE` or minimum lexicographical string if BY is `LEX`.
	 * @param stop - Stop index by default, minimum score if BY is `SCORE` or minimum lexicographical string if BY is `LEX`.
	 * @param options -
	 * @returns List of members in the specified range with their scores.
	 */
	ZRANGE(
		key: string,
		start: string | number,
		stop: string | number,
		options: ZrangeOptions,
	): RedisXTransactionCommand<{
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
	 */
	ZINTERSTORE(
		destination: string,
		keys: (string | number)[],
		options?: ZinterstoreOptions,
	): RedisXTransactionCommand<number>;
	/**
	 * Computes the intersection of sorted sets given by the specified keys, and stores the result in destination. It is mandatory to provide the number of input keys (numkeys) before passing the input keys and the other (optional) arguments.
	 * - Available since: 2.0.0.
	 * - Time complexity: O(N*K)+O(M*log(M)).
	 * @param destination Destination key where the resulting sorted set should be stored.
	 * @param keys_with_weights Record where keys are the keys that holds sorted sets and values are the weights to apply to the sorted sets.
	 * @param options -
	 * @returns The number of members in the resulting sorted set at the destination.
	 */
	ZINTERSTORE(
		destination: string,
		keys_with_weights: Record<string, number>,
		options?: ZinterstoreOptions,
	): RedisXTransactionCommand<number>;

	ZINTERSTORE(
		destination: string,
		arg1: (string | number)[] | Record<string, number>,
		options?: ZinterstoreOptions,
	): RedisXTransactionCommand<number> {
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
	 */
	HSET(
		key: string,
		field: string,
		value: string | number,
	): RedisXTransactionCommand<number>;
	/**
	 * Sets the specified fields to their respective values in the hash stored at key.
	 * - Available since: 2.0.0.
	 * - Multiple field/value pairs are available since Redis 4.0.0.
	 * - Time complexity: O(1) for each field/value pair added.
	 * @param key Key that contains the hash.
	 * @param pairs Object containing field/value pairs to set.
	 * @returns The number of fields that were added.
	 */
	HSET(
		key: string,
		pairs: Record<
			string,
			string | number
		>
	): RedisXTransactionCommand<number>;

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
	 * @returns Value of the key.
	 */
	HGETALL(key: string): RedisXTransactionCommand<Record<string, string>> {
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
	EVAL(
		script: string,
		keys: (string | number)[],
		args?: (string | number)[],
	): RedisXTransactionCommand<unknown> {
		return this.useCommand(input_eval(script, keys, args));
	}

	// MARK: end commands
}

// MARK: imports
import {
	input as input_get,
} from '../commands/string/get.js';
import {
	type SetOptions,
	input as input_set,
} from '../commands/string/set.js';
import {
	type ExpireOptions,
	input as input_expire,
} from '../commands/generic/expire.js';
import {
	input as input_keys,
} from '../commands/generic/keys.js';
import {
	input as input_del,
} from '../commands/generic/del.js';
import {
	input as input_lpush,
} from '../commands/list/lpush.js';
import {
	input as input_zcard,
} from '../commands/sorted-set/zcard.js';
import {
	input as input_zscore,
} from '../commands/sorted-set/zscore.js';
import {
	type ZaddOptions,
	input as input_zadd,
} from '../commands/sorted-set/zadd.js';
import {
	input as input_zrem,
} from '../commands/sorted-set/zrem.js';
import {
	type ZrangeOptions,
	input as input_zrange,
} from '../commands/sorted-set/zrange.js';
import {
	type ZinterstoreOptions,
	input as input_zinterstore,
} from '../commands/sorted-set/zinterstore.js';
import {
	input as input_hset,
} from '../commands/hash/hset.js';
import {
	input as input_hgetall,
} from '../commands/hash/hgetall.js';
import {
	input as input_eval,
} from '../commands/scripting/eval.js';
// MARK: end imports
