import { expect, test } from 'vitest';
import { mixedCollectionCases } from '../../../test/collection-cases.js';
import { input } from './smismember.js';

test('numeric first rest argument', () => {
	const command = input('myset', 0, 'foo');
	expect(command.args).toStrictEqual(['SMISMEMBER', 'myset', '0', 'foo']);
});

test.each(mixedCollectionCases)(
	'%s arguments',
	(_name, createValues, expected) => {
		const command = input('myset', createValues());
		expect(command.args).toStrictEqual(['SMISMEMBER', 'myset', ...expected]);
	},
);

test('command', () => {
	const command = input('myset', 'member1', 'member2', 0);
	expect(command.args).toStrictEqual([
		'SMISMEMBER',
		'myset',
		'member1',
		'member2',
		'0',
	]);

	expect(command.replyTransform?.([1, 0, 1])).toStrictEqual([
		true,
		false,
		true,
	]);
});
