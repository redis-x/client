import { describe, expect, test } from 'vitest';
import { input } from './eval_ro.js';

const script = "return redis.call('GET', KEYS[1])";

describe('command', () => {
	test('keys and arguments', () => {
		const command = input(script, ['mykey', 1], ['bar', 2]);
		expect(command.args).toStrictEqual([
			'EVAL_RO',
			script,
			'2',
			'mykey',
			'1',
			'bar',
			'2',
		]);

		expect(command.replyTransform).toBeUndefined();
	});

	test('keys without arguments', () => {
		const command = input(script, ['mykey']);
		expect(command.args).toStrictEqual(['EVAL_RO', script, '1', 'mykey']);
	});
});
