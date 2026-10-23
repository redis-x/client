import { describe, expect, test } from 'vitest';
import { input } from './zrandmember.js';

describe('command', () => {
	test('without count', () => {
		const command = input('dadi');
		expect(command.args).toStrictEqual(['ZRANDMEMBER', 'dadi']);
	});

	test('positive count', () => {
		const command = input('dadi', 2);
		expect(command.args).toStrictEqual(['ZRANDMEMBER', 'dadi', '2']);
	});

	test('negative count', () => {
		const command = input('dadi', -5);
		expect(command.args).toStrictEqual(['ZRANDMEMBER', 'dadi', '-5']);
	});

	test('option WITHSCORES', () => {
		const command = input('dadi', -5, { WITHSCORES: true });
		expect(command.args).toStrictEqual([
			'ZRANDMEMBER',
			'dadi',
			'-5',
			'WITHSCORES',
		]);
	});

	test('option WITHSCORES disabled', () => {
		const command = input('dadi', 2, { WITHSCORES: false });
		expect(command.args).toStrictEqual(['ZRANDMEMBER', 'dadi', '2']);
	});
});

describe('reply', () => {
	test('member without count', () => {
		const command = input('dadi');
		expect(command.replyTransform!('uno')).toBe('uno');
		expect(command.replyTransform!(null)).toBeNull();
	});

	test('members with count', () => {
		const command = input('dadi', 2);
		expect(command.replyTransform!(['uno', 'due'])).toStrictEqual([
			'uno',
			'due',
		]);
	});

	test('members with WITHSCORES disabled', () => {
		const command = input('dadi', 2, { WITHSCORES: false });
		expect(command.replyTransform!(['uno', 'due'])).toStrictEqual([
			'uno',
			'due',
		]);
	});

	test('members and scores with WITHSCORES', () => {
		const command = input('dadi', -2, { WITHSCORES: true });
		expect(command.replyTransform!(['uno', '1', 'uno', '1'])).toStrictEqual([
			{ member: 'uno', score: 1 },
			{ member: 'uno', score: 1 },
		]);
	});
});
