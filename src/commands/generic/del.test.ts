import { expect, test } from 'vitest';
import { stringCollectionCases } from '../../../test/collection-cases.js';
import { input } from './del.js';

test.each(stringCollectionCases)(
	'%s arguments',
	(_name, createValues, expected) => {
		const command = input(createValues());
		expect(command.args).toStrictEqual(['DEL', ...expected]);
	},
);

test('command', () => {
	const command = input('key1', 'key2');
	expect(command.args).toStrictEqual(['DEL', 'key1', 'key2']);

	expect(command.replyTransform).toBeUndefined();
});
