import { describe, expect, test } from 'vitest';
import { input } from './hincrby.js';

describe('command', () => {
	test('positive increment', () => {
		const command = input('myhash', 'field1', 5);
		expect(command.args).toStrictEqual(['HINCRBY', 'myhash', 'field1', '5']);

		expect(command.replyTransform).toBeUndefined();
	});

	test('negative increment', () => {
		const command = input('myhash', 'field1', -15);
		expect(command.args).toStrictEqual(['HINCRBY', 'myhash', 'field1', '-15']);

		expect(command.replyTransform).toBeUndefined();
	});
});
