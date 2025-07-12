import { describe, expect, test } from 'vitest';
import { input } from './hdel.js';

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
