import { expect, test } from 'vitest';
import { stringCollectionCases } from '../../../test/collection-cases.js';
import { input } from './sinterstore.js';

test.each(stringCollectionCases)(
	'%s arguments',
	(_name, createValues, expected) => {
		const command = input('destination', createValues());
		expect(command.args).toStrictEqual([
			'SINTERSTORE',
			'destination',
			...expected,
		]);
	},
);

test('command', () => {
	const command = input('destination', 'key1', 'key2');
	expect(command.args).toStrictEqual([
		'SINTERSTORE',
		'destination',
		'key1',
		'key2',
	]);

	expect(command.replyTransform).toBeUndefined();
});
