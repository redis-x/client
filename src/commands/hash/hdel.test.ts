import { describe, expect, test } from 'vitest';
import { input } from './hdel.js';

describe('command', () => {
	test('numeric first rest argument', () => {
		const command = input('myhash', 0, 'foo');
		expect(command.args).toStrictEqual(['HDEL', 'myhash', '0', 'foo']);
	});

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
