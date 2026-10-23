import { describe, expect, test } from 'vitest';
import { input } from './smismember.js';

describe('command', () => {
	test('numeric first rest argument', () => {
		const command = input('myset', 0, 'foo');
		expect(command.args).toStrictEqual(['SMISMEMBER', 'myset', '0', 'foo']);
	});

	test('rest arguments', () => {
		const command = input('myset', 'member1', 'member2', 0);
		expect(command.args).toStrictEqual([
			'SMISMEMBER',
			'myset',
			'member1',
			'member2',
			'0',
		]);
	});

	test('collection argument', () => {
		const command = input('myset', ['member1', 0]);
		expect(command.args).toStrictEqual(['SMISMEMBER', 'myset', 'member1', '0']);
	});
});

test('reply', () => {
	const command = input('myset', 'member1', 'member2', 0);
	expect(command.replyTransform?.([1, 0, 1])).toStrictEqual([
		true,
		false,
		true,
	]);
});
