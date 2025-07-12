import * as v from 'valibot';
import { beforeAll, describe, expect, test } from 'vitest';
import { redisClient, redisXClient } from '../test/client.js';
import { createRandomKey } from '../test/utils.js';
import { strictParser } from '../test/vx.js';

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
				v.transform((value) => Number.parseInt(value)),
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
