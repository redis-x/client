import { describe, expect, test } from 'vitest';
import { mixedCollectionCases } from '../../../test/collection-cases.js';
import { input } from './srem.js';

test('numeric first rest argument', () => {
	const command = input('myset', 0, 'foo');
	expect(command.args).toStrictEqual(['SREM', 'myset', '0', 'foo']);
});

test.each(mixedCollectionCases)(
	'%s arguments',
	(_name, createValues, expected) => {
		const command = input('myset', createValues());
		expect(command.args).toStrictEqual(['SREM', 'myset', ...expected]);
	},
);

describe('command', () => {
	test('array arguments', () => {
		const command = input('myset', ['foo', 'bar', 1]);
		expect(command.args).toStrictEqual(['SREM', 'myset', 'foo', 'bar', '1']);

		expect(command.replyTransform).toBeUndefined();
	});

	test('rest arguments', () => {
		const command = input('myset', 'foo', 'bar', 1);
		expect(command.args).toStrictEqual(['SREM', 'myset', 'foo', 'bar', '1']);

		expect(command.replyTransform).toBeUndefined();
	});
});
