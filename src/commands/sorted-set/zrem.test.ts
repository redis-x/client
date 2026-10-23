import { describe, expect, test } from 'vitest';
import { input } from './zrem.js';

describe('command', () => {
	test('collection argument', () => {
		const command = input('key', ['member1', 2]);
		expect(command.args).toStrictEqual(['ZREM', 'key', 'member1', '2']);
	});

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
