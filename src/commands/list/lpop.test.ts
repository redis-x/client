import { describe, expect, test } from 'vitest';
import { input } from './lpop.js';

describe('command', () => {
	test('no count', () => {
		const command = input('mylist');
		expect(command.args).toStrictEqual(['LPOP', 'mylist']);

		expect(command.replyTransform).toBeUndefined();
	});

	test('with count', () => {
		const command = input('mylist', 3);
		expect(command.args).toStrictEqual(['LPOP', 'mylist', '3']);

		expect(command.replyTransform).toBeUndefined();
	});
});
