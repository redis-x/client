import { describe, expect, test } from 'vitest';
import { mixedCollectionCases } from '../../../test/collection-cases.js';
import { input } from './zrem.js';

test.each(mixedCollectionCases)(
	'%s arguments',
	(_name, createValues, expected) => {
		const command = input('key', createValues());
		expect(command.args).toStrictEqual(['ZREM', 'key', ...expected]);

		expect(command.replyTransform).toBeUndefined();
	},
);

describe('command', () => {
	test('single member', () => {
		const command = input('key', 'member');

		expect(command.args).toStrictEqual(['ZREM', 'key', 'member']);

		expect(command.replyTransform).toBeUndefined();
	});

	test('multi members', () => {
		const command = input('key', 'member1', 'member2', 'member3');

		expect(command.args).toStrictEqual([
			'ZREM',
			'key',
			'member1',
			'member2',
			'member3',
		]);

		expect(command.replyTransform).toBeUndefined();
	});
});
