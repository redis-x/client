import { describe, expect, test } from 'vitest';
import { input } from './zrevrangebyscore.js';

describe('command', () => {
	test('inclusive range', () => {
		const command = input('myzset', 2, 1);
		expect(command.args).toStrictEqual([
			'ZREVRANGEBYSCORE',
			'myzset',
			'2',
			'1',
		]);
	});

	test('infinite range', () => {
		const command = input('myzset', '+inf', '-inf');
		expect(command.args).toStrictEqual([
			'ZREVRANGEBYSCORE',
			'myzset',
			'+inf',
			'-inf',
		]);
	});

	test('exclusive range', () => {
		const command = input('myzset', '(2', '(1');
		expect(command.args).toStrictEqual([
			'ZREVRANGEBYSCORE',
			'myzset',
			'(2',
			'(1',
		]);
	});

	test('option WITHSCORES', () => {
		const command = input('myzset', 2, 1, { WITHSCORES: true });
		expect(command.args).toStrictEqual([
			'ZREVRANGEBYSCORE',
			'myzset',
			'2',
			'1',
			'WITHSCORES',
		]);
	});

	test('option LIMIT', () => {
		const command = input('myzset', 2, 1, { LIMIT: [0, 10] });
		expect(command.args).toStrictEqual([
			'ZREVRANGEBYSCORE',
			'myzset',
			'2',
			'1',
			'LIMIT',
			'0',
			'10',
		]);
	});

	test('options WITHSCORES and LIMIT', () => {
		const command = input('myzset', '+inf', '-inf', {
			WITHSCORES: true,
			LIMIT: [1, 2],
		});
		expect(command.args).toStrictEqual([
			'ZREVRANGEBYSCORE',
			'myzset',
			'+inf',
			'-inf',
			'WITHSCORES',
			'LIMIT',
			'1',
			'2',
		]);
	});

	test('option WITHSCORES disabled', () => {
		const command = input('myzset', 2, 1, { WITHSCORES: false });
		expect(command.args).toStrictEqual([
			'ZREVRANGEBYSCORE',
			'myzset',
			'2',
			'1',
		]);
	});
});

describe('reply', () => {
	test('members', () => {
		const command = input('myzset', 2, 1);
		expect(command.replyTransform!(['two', 'one'])).toStrictEqual([
			'two',
			'one',
		]);
	});

	test('members with WITHSCORES disabled', () => {
		const command = input('myzset', 2, 1, { WITHSCORES: false });
		expect(command.replyTransform!(['two', 'one'])).toStrictEqual([
			'two',
			'one',
		]);
	});

	test('members and scores with WITHSCORES', () => {
		const command = input('myzset', 2, 1, { WITHSCORES: true });
		expect(command.replyTransform!(['two', '2', 'one', '1'])).toStrictEqual([
			{ member: 'two', score: 2 },
			{ member: 'one', score: 1 },
		]);
	});
});
