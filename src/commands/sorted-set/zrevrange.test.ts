import { describe, expect, test } from 'vitest';
import { input } from './zrevrange.js';

describe('command', () => {
	test('range', () => {
		const command = input('myzset', 0, 1);
		expect(command.args).toStrictEqual(['ZREVRANGE', 'myzset', '0', '1']);
	});

	test('negative indexes', () => {
		const command = input('myzset', -2, -1);
		expect(command.args).toStrictEqual(['ZREVRANGE', 'myzset', '-2', '-1']);
	});

	test('option WITHSCORES', () => {
		const command = input('myzset', 0, -1, { WITHSCORES: true });
		expect(command.args).toStrictEqual([
			'ZREVRANGE',
			'myzset',
			'0',
			'-1',
			'WITHSCORES',
		]);
	});

	test('option WITHSCORES disabled', () => {
		const command = input('myzset', 0, -1, { WITHSCORES: false });
		expect(command.args).toStrictEqual(['ZREVRANGE', 'myzset', '0', '-1']);
	});
});

describe('reply', () => {
	test('members', () => {
		const command = input('myzset', 0, -1);
		expect(command.replyTransform!(['three', 'two'])).toStrictEqual([
			'three',
			'two',
		]);
	});

	test('members with WITHSCORES disabled', () => {
		const command = input('myzset', 0, -1, { WITHSCORES: false });
		expect(command.replyTransform!(['three', 'two'])).toStrictEqual([
			'three',
			'two',
		]);
	});

	test('members and scores with WITHSCORES', () => {
		const command = input('myzset', 0, -1, { WITHSCORES: true });
		expect(command.replyTransform!(['three', '3', 'two', '2'])).toStrictEqual([
			{ member: 'three', score: 3 },
			{ member: 'two', score: 2 },
		]);
	});
});
