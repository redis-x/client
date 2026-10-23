import { describe, expect, test } from 'vitest';
import { input } from './rpushx.js';

describe('command', () => {
	test('array arguments', () => {
		const command = input('mylist', ['hello', 'world', 1]);
		expect(command.args).toStrictEqual([
			'RPUSHX',
			'mylist',
			'hello',
			'world',
			'1',
		]);

		expect(command.replyTransform).toBeUndefined();
	});

	test('rest arguments', () => {
		const command = input('mylist', 'hello', 'world', 1);
		expect(command.args).toStrictEqual([
			'RPUSHX',
			'mylist',
			'hello',
			'world',
			'1',
		]);

		expect(command.replyTransform).toBeUndefined();
	});
});
