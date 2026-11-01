import { describe, expect, test } from 'vitest';
import { input } from './hmget.js';

describe('command', () => {
	test('numeric first rest argument', () => {
		const command = input('myhash', 0, 'foo');
		expect(command.args).toStrictEqual(['HMGET', 'myhash', '0', 'foo']);
	});

	test('collection argument', () => {
		const command = input('myhash', ['field1', 2]);
		expect(command.args).toStrictEqual(['HMGET', 'myhash', 'field1', '2']);

		expect(command.replyTransform).toBeUndefined();
	});

	test('rest arguments', () => {
		const command = input('myhash', 'field1', 2);
		expect(command.args).toStrictEqual(['HMGET', 'myhash', 'field1', '2']);

		expect(command.replyTransform).toBeUndefined();
	});
});
