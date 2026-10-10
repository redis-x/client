import { describe, expect, test } from 'vitest';
import { mixedCollectionCases } from '../../../test/collection-cases.js';
import { input } from './hdel.js';

test('numeric first rest argument', () => {
	const command = input('myhash', 0, 'foo');
	expect(command.args).toStrictEqual(['HDEL', 'myhash', '0', 'foo']);
});

test.each(mixedCollectionCases)(
	'%s arguments',
	(_name, createValues, expected) => {
		const command = input('myhash', createValues());
		expect(command.args).toStrictEqual(['HDEL', 'myhash', ...expected]);
	},
);

describe('command', () => {
	test('array arguments', () => {
		const command = input('myhash', ['field1', 'field2', 3]);
		expect(command.args).toStrictEqual([
			'HDEL',
			'myhash',
			'field1',
			'field2',
			'3',
		]);

		expect(command.replyTransform).toBeUndefined();
	});

	test('rest arguments', () => {
		const command = input('myhash', 'field1', 'field2', 3);
		expect(command.args).toStrictEqual([
			'HDEL',
			'myhash',
			'field1',
			'field2',
			'3',
		]);

		expect(command.replyTransform).toBeUndefined();
	});
});
