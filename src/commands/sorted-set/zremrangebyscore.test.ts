import { describe, expect, test } from 'vitest';
import { input } from './zremrangebyscore.js';

describe('command', () => {
	test('numeric range', () => {
		const command = input('myzset', 1, 3);
		expect(command.args).toStrictEqual([
			'ZREMRANGEBYSCORE',
			'myzset',
			'1',
			'3',
		]);

		expect(command.replyTransform).toBeUndefined();
	});

	test('infinite range', () => {
		const command = input('myzset', '-inf', '+inf');
		expect(command.args).toStrictEqual([
			'ZREMRANGEBYSCORE',
			'myzset',
			'-inf',
			'+inf',
		]);
	});

	test('exclusive bounds', () => {
		const command = input('myzset', '(1', '(2.5');
		expect(command.args).toStrictEqual([
			'ZREMRANGEBYSCORE',
			'myzset',
			'(1',
			'(2.5',
		]);
	});
});
