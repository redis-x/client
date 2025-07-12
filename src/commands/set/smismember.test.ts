import { expect, test } from 'vitest';
import { input } from './smismember.js';

test('command', () => {
	const command = input('myset', 'member1', 'member2');
	expect(command.args).toStrictEqual([
		'SMISMEMBER',
		'myset',
		'member1',
		'member2',
	]);

	expect(command.replyTransform?.([1, 0])).toStrictEqual([true, false]);
});
