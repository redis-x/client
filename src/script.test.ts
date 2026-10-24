import * as v from 'valibot';
import { beforeAll, describe, expect, test } from 'vitest';
import { redisClient, redisXClient } from '../test/client.js';
import { createRandomKey } from '../test/utils.js';
import { strictParser } from '../test/vx.js';
import { RedisXScriptValidationError } from './script.js';

const PREFIX = createRandomKey();

beforeAll(async () => {
	await redisClient.FLUSHDB();

	for (let increment = 0; increment < 10; increment++) {
		// oxlint-disable-next-line no-await-in-loop
		await redisClient.SET(`${PREFIX}:${increment}`, increment);
	}
});

test('(code)', async () => {
	const script = redisXClient.createScript(
		'local a = redis.call("KEYS", "key:*") return a',
	);

	const result = await script.execute();
	expect(Array.isArray(result)).toBe(true);
	// type guard
	if (Array.isArray(result)) {
		expect(result.length).toBe(10);
	}
});

test('(code, keys)', async () => {
	const redisXScript = redisXClient.createScript(
		'return redis.call("GET", KEYS[1])',
		[`${PREFIX}:4`],
	);

	const result = await redisXScript.execute();
	expect(result).toBe('4');
});

test('(code, outputValidator)', async () => {
	const script = redisXClient.createScript(
		'local a = redis.call("KEYS", ARGV[1]) return a',
		v.parser(
			v.pipe(
				v.array(v.string()),
				v.transform((value) => new Set(value)),
			),
		),
	);

	const result = await script.execute('key:*');
	expect(result instanceof Set).toBe(true);
	// NO type guard needed
	expect(result.size).toBe(10);
});

test('(code, keys, outputValidator)', async () => {
	const script = redisXClient.createScript(
		'return redis.call("GET", KEYS[1])',
		[`${PREFIX}:4`],
		v.parser(
			v.pipe(
				v.string(),
				v.transform((value) => Math.trunc(Number(value))),
			),
		),
	);

	const result = await script.execute();
	expect(result).toBe(4);
});

describe('(options)', () => {
	test('{ code, inputValidator, outputValidator }', async () => {
		const script = redisXClient.createScript({
			code: 'local a = redis.call("KEYS", ARGV[1]) return a',
			inputValidator: strictParser(v.pipe(v.tuple([v.string()]))),
			outputValidator: v.parser(
				v.pipe(
					v.array(v.string()),
					v.transform((value) => new Set(value)),
				),
			),
		});

		const result = await script.execute('key:*');
		expect(result instanceof Set).toBe(true);
		// NO type guard needed
		expect(result.size).toBe(10);
	});
});

describe('(options) with schemas', () => {
	test('{ code, inputSchema, outputSchema }', async () => {
		const script = redisXClient.createScript({
			code: 'local a = redis.call("KEYS", ARGV[1]) return a',
			inputSchema: v.tuple([v.string()]),
			outputSchema: v.pipe(
				v.array(v.string()),
				v.transform((value) => new Set(value)),
			),
		});

		const result: Set<string> = await script.execute('key:*');
		expect(result.size).toBe(10);
	});

	test('{ code, inputSchema, outputValidator }', async () => {
		const script = redisXClient.createScript({
			code: 'return redis.call("GET", ARGV[1])',
			inputSchema: v.tuple([
				v.pipe(
					v.number(),
					v.transform((value) => `${PREFIX}:${value}`),
				),
			]),
			outputValidator: v.parser(v.pipe(v.string(), v.transform(Number))),
		});

		const result: number = await script.execute(4);
		expect(result).toBe(4);
	});

	test('{ code, inputValidator, outputSchema }', async () => {
		const script = redisXClient.createScript({
			code: 'return redis.call("GET", ARGV[1])',
			inputValidator: (value: [number]) => [`${PREFIX}:${value[0]}`],
			outputSchema: v.pipe(v.string(), v.transform(Number)),
		});

		const result: number = await script.execute(7);
		expect(result).toBe(7);
	});

	test('async schemas', async () => {
		const script = redisXClient.createScript({
			code: 'return redis.call("GET", ARGV[1])',
			inputSchema: v.pipeAsync(
				v.tuple([v.number()]),
				v.transformAsync(([value]) => Promise.resolve([`${PREFIX}:${value}`])),
			),
			outputSchema: v.pipeAsync(
				v.string(),
				v.transformAsync((value) => Promise.resolve(Number(value))),
			),
		});

		const result: number = await script.execute(2);
		expect(result).toBe(2);
	});

	test('validates input once when the script is reloaded', async () => {
		let calls = 0;
		const script = redisXClient.createScript({
			code: 'return ARGV[1]',
			inputSchema: v.pipe(
				v.tuple([v.string()]),
				v.check(() => {
					calls++;
					return true;
				}),
			),
		});

		expect(await script.execute('first')).toBe('first');
		await redisClient.sendCommand(['SCRIPT', 'FLUSH']);
		expect(await script.execute('second')).toBe('second');
		expect(calls).toBe(2);
	});
});

describe('schema errors', () => {
	test('input issues reject before the script runs', async () => {
		const key = `${PREFIX}:input-issues`;
		const script = redisXClient.createScript({
			code: 'return redis.call("SET", KEYS[1], ARGV[1])',
			keys: [key],
			inputSchema: v.tuple([v.pipe(v.string(), v.minLength(3))]),
		});

		await expect(script.execute('ab')).rejects.toBeInstanceOf(
			RedisXScriptValidationError,
		);
		await expect(script.execute('ab')).rejects.toMatchObject({
			name: 'RedisXScriptValidationError',
			target: 'input',
			issues: [expect.objectContaining({ message: expect.any(String) })],
		});
		expect(await redisClient.GET(key)).toBeNull();
	});

	test('arguments that do not match the input schema are type errors', async () => {
		const script = redisXClient.createScript({
			code: 'return 1',
			inputSchema: v.tuple([v.string(), v.number()]),
		});

		await expect(
			// @ts-expect-error arguments must match the input schema
			script.execute(1, 'a'),
		).rejects.toBeInstanceOf(RedisXScriptValidationError);
	});

	test('output issues reject with the output target', async () => {
		const script = redisXClient.createScript({
			code: 'return "not a number"',
			outputSchema: v.number(),
		});

		await expect(script.execute()).rejects.toMatchObject({
			name: 'RedisXScriptValidationError',
			target: 'output',
		});
	});

	test('input schemas must accept an array or a tuple', () => {
		const scripts = [
			// @ts-expect-error object input
			redisXClient.createScript({
				code: 'return 1',
				inputSchema: v.object({ key: v.string() }),
			}),
			// @ts-expect-error object input, even when converted to script arguments
			redisXClient.createScript({
				code: 'return 1',
				inputSchema: v.pipe(
					v.object({ key: v.string() }),
					v.transform((value) => [value.key]),
				),
			}),
			// @ts-expect-error input schema output must be script arguments
			redisXClient.createScript({
				code: 'return 1',
				inputSchema: v.tuple([v.boolean()]),
			}),
		];

		expect(scripts).toHaveLength(3);
	});

	test('a validator and a schema for the same side throw', () => {
		expect(() =>
			// @ts-expect-error inputValidator and inputSchema together
			redisXClient.createScript({
				code: 'return 1',
				inputValidator: (value: string[]) => value,
				inputSchema: v.array(v.string()),
			}),
		).toThrow(TypeError);

		expect(() =>
			// @ts-expect-error outputValidator and outputSchema together
			redisXClient.createScript({
				code: 'return 1',
				outputValidator: (value: unknown) => value,
				outputSchema: v.unknown(),
			}),
		).toThrow(TypeError);
	});
});
