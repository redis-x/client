import { describe, expect, test } from 'vitest';
import { input } from './lpush.js';

describe('command', () => {
	test('array arguments', () => {
		const command = input('mylist', ['apple', 'banana', 1]);
		expect(command.args).toStrictEqual([
			'LPUSH',
			'mylist',
			'apple',
			'banana',
			'1',
		]);

		expect(command.replyTransform).toBeUndefined();
	});

	test('rest arguments', () => {
		const command = input('mylist', 'apple', 'banana', 1);
		expect(command.args).toStrictEqual([
			'LPUSH',
			'mylist',
			'apple',
			'banana',
			'1',
		]);

		expect(command.replyTransform).toBeUndefined();
	});
});
