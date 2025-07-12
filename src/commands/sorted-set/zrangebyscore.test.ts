import { describe, expect, test } from 'vitest';
import { input } from './zrangebyscore.js';

describe('command', () => {
	test('inclusive range', () => {
		const command = input('myzset', 1, 5);
		expect(command.args).toStrictEqual(['ZRANGEBYSCORE', 'myzset', '1', '5']);

		expect(command.replyTransform?.(['foo', 'bar'])).toStrictEqual([
			'foo',
			'bar',
		]);
	});

	test('infinity range', () => {
		const command = input('myzset', '-inf', '+inf');
		expect(command.args).toStrictEqual([
			'ZRANGEBYSCORE',
			'myzset',
			'-inf',
			'+inf',
		]);

		expect(command.replyTransform?.(['foo', 'bar'])).toStrictEqual([
			'foo',
			'bar',
		]);
	});

	test('exclusive range', () => {
		const command = input('myzset', '(1', '(5');
		expect(command.args).toStrictEqual(['ZRANGEBYSCORE', 'myzset', '(1', '(5']);

		expect(command.replyTransform?.(['foo', 'bar'])).toStrictEqual([
			'foo',
			'bar',
		]);
	});

	test('option WITHSCORES', () => {
		const command = input('myzset', 1, 5, { WITHSCORES: true });
		expect(command.args).toStrictEqual([
			'ZRANGEBYSCORE',
			'myzset',
			'1',
			'5',
			'WITHSCORES',
		]);

		expect(command.replyTransform?.(['foo', '1', 'bar', '2'])).toStrictEqual([
			{
				member: 'foo',
				score: 1,
			},
			{
				member: 'bar',
				score: 2,
			},
		]);
	});

	test('option LIMIT', () => {
		const command = input('myzset', 1, 5, { LIMIT: [0, 10] });
		expect(command.args).toStrictEqual([
			'ZRANGEBYSCORE',
			'myzset',
			'1',
			'5',
			'LIMIT',
			'0',
			'10',
		]);

		expect(command.replyTransform?.(['foo', 'bar'])).toStrictEqual([
			'foo',
			'bar',
		]);
	});
});
