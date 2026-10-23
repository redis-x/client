import { expect, test } from 'vitest';
import { stringCollectionCases } from '../../../test/collection-cases.js';
import { input } from './sinter.js';

test.each(stringCollectionCases)(
	'%s arguments',
	(_name, createValues, expected) => {
		const command = input(createValues());
		expect(command.args).toStrictEqual(['SINTER', ...expected]);
	},
);

test('command', () => {
	const command = input('key1', 'key2', 'key3');
	expect(command.args).toStrictEqual(['SINTER', 'key1', 'key2', 'key3']);

	expect(command.replyTransform).toBeTypeOf('function');
});
