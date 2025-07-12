import { describe, expect, test } from 'vitest';
import { input } from './zrem.js';

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

	test('set members', () => {
		const command = input('key', new Set(['member1', 'member2']));

		expect(command.args).toStrictEqual(['ZREM', 'key', 'member1', 'member2']);

		expect(command.replyTransform).toBeUndefined();
	});
});
