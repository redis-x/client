import { describe, expect, test } from 'vitest';
import { input } from './lrem.js';

describe('command', () => {
	test('positive count', () => {
		const command = input('mylist', 2, 'hello');
		expect(command.args).toStrictEqual(['LREM', 'mylist', '2', 'hello']);

		expect(command.replyTransform).toBeUndefined();
	});

	test('zero count', () => {
		const command = input('mylist', 0, 'hello');
		expect(command.args).toStrictEqual(['LREM', 'mylist', '0', 'hello']);

		expect(command.replyTransform).toBeUndefined();
	});

	test('negative count', () => {
		const command = input('mylist', -3, 'hello');
		expect(command.args).toStrictEqual(['LREM', 'mylist', '-3', 'hello']);

		expect(command.replyTransform).toBeUndefined();
	});
});
