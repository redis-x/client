import { expect, test } from 'vitest';
import { stringCollectionCases } from '../../../test/collection-cases.js';
import { input } from './sunion.js';

test.each(stringCollectionCases)(
	'%s arguments',
	(_name, createValues, expected) => {
		const command = input(createValues());
		expect(command.args).toStrictEqual(['SUNION', ...expected]);
	},
);

test('command', () => {
	const command = input('key1', 'key2', 'key3');
	expect(command.args).toStrictEqual(['SUNION', 'key1', 'key2', 'key3']);

	expect(command.replyTransform).toBeTypeOf('function');
});
