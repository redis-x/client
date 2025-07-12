import { describe, expect, test } from 'vitest';
import { input } from './hincrbyfloat.js';

describe('command', () => {
	test('positive increment', () => {
		const command = input('myhash', 'field1', 0.1);
		expect(command.args).toStrictEqual([
			'HINCRBYFLOAT',
			'myhash',
			'field1',
			'0.1',
		]);

		expect(command.replyTransform).toBeUndefined();
	});

	test('negative increment', () => {
		const command = input('myhash', 'field1', -5.4);
		expect(command.args).toStrictEqual([
			'HINCRBYFLOAT',
			'myhash',
			'field1',
			'-5.4',
		]);

		expect(command.replyTransform).toBeUndefined();
	});
});
