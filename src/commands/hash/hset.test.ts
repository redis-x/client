import { describe, expect, test } from 'vitest';
import { input } from './hset.js';

describe('command', () => {
	test('inline pair', () => {
		const command = input('key', 'apple', 'red');

		expect(command.args).toStrictEqual(['HSET', 'key', 'apple', 'red']);

		expect(command.replyTransform).toBeUndefined();
	});

	test('object', () => {
		const command = input('key', {
			apple: 'red',
			banana: 'yellow',
		});

		expect(command.args).toStrictEqual([
			'HSET',
			'key',
			'apple',
			'red',
			'banana',
			'yellow',
		]);

		expect(command.replyTransform).toBeUndefined();
	});
});
