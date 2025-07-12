import { beforeAll, describe, expect, test } from 'vitest';
import { redisClient } from '../test/client.js';
import { createRandomKey } from '../test/utils.js';
import { RedisXTransaction } from './transaction.js';

const PREFIX = createRandomKey();

beforeAll(async () => {
	for (let increment = 0; increment < 10; increment++) {
		// oxlint-disable-next-line no-await-in-loop
		await redisClient.SET(`${PREFIX}:${increment}`, increment);
	}
});

test('just commands', async () => {
	const key = createRandomKey();

	const result = await new RedisXTransaction(redisClient)
		// testing unknown commands
		.addCommand('HSET', key, 'foo', '1', 'baz', '2')
		// tedting command with no transformer
		.GET(`${PREFIX}:3`)
		// testing command with transformer
		.HGETALL(key)
		.execute();

	expect(result).toStrictEqual([
		2,
		'3',
		{
			foo: '1',
			baz: '2',
		},
	]);
});

describe('as', () => {
	test('basic', async () => {
		const result = await new RedisXTransaction(redisClient)
			.addCommand('GET', `${PREFIX}:1`)
			.GET(`${PREFIX}:2`)
			.as('foo')
			.SET('bar', 1)
			.execute();

		expect(result[0]).toBe('1');
		expect(result[1]).toBe('2');
		expect(result[2]).toBe('OK');
		expect(result.foo).toBe('2');
	});

	test('reusing name', async () => {
		const result = await new RedisXTransaction(redisClient)
			.GET(`${PREFIX}:2`)
			.as('foo')
			.SET('bar', 1)
			.as('foo')
			.execute();

		expect(result[0]).toBe('2');
		expect(result[1]).toBe('OK');
		expect(result.foo).toBe('OK');
	});
});

describe('use', () => {
	test('basic', async () => {
		const result = await new RedisXTransaction(redisClient)
			.GET(`${PREFIX}:2`)
			.use((transaction) => {
				return {
					foo: 1,
					bar: transaction.SET('foo', 1),
				};
			})
			.execute();

		expect(
			// @ts-expect-error "result" SHOULD NOT to be an array
			result[0],
		).toBeUndefined();
		expect(result.foo).toBe(1);
		expect(result.bar).toBe('OK');
	});

	test('no return', async () => {
		const result = await new RedisXTransaction(redisClient)
			.GET(`${PREFIX}:2`)
			.use((transaction) => {
				transaction.SET('foo', 1);
			})
			.execute();

		expect(result).toStrictEqual({});
	});

	test('addCommand', async () => {
		const result = await new RedisXTransaction(redisClient)
			.GET(`${PREFIX}:2`)
			.use((transaction) => {
				return {
					value: transaction.addCommand('SET', 'foo', 1),
				};
			})
			.execute();

		expect(result).toStrictEqual({ value: 'OK' });
	});

	test('multiple with if', async () => {
		for (const ref of [true, false]) {
			// oxlint-disable-next-line no-await-in-loop
			const result = await new RedisXTransaction(redisClient)
				.GET(`${PREFIX}:2`)
				.use((transaction) => {
					return {
						foo: 1,
						bar: transaction.SET('foo', 1),
					};
				})
				.use((transaction) => {
					if (ref) {
						return {
							baz: 2,
						};
					}

					return {
						baz: transaction.GET(`${PREFIX}:4`),
					};
				})
				.execute();

			expect(
				// @ts-expect-error "result" SHOULD NOT to be an array
				result[0],
			).toBeUndefined();
			expect(result.foo).toBe(1);
			expect(result.bar).toBe('OK');
			expect(result.baz).toBe(ref ? 2 : '4');
		}
	});

	test('with as', async () => {
		const result = await new RedisXTransaction(redisClient)
			.GET(`${PREFIX}:2`)
			.as('foo')
			.use((transaction) => {
				return {
					bar: transaction.SET('foo', 1),
				};
			})
			.execute();

		expect(
			// @ts-expect-error "result" SHOULD NOT to be an array
			result[0],
		).toBeUndefined();
		expect(result.foo).toBe('2');
		expect(result.bar).toBe('OK');
	});
});
