import { describe, expect, test } from 'vitest';
import { input } from './mget.js';

describe('command', () => {
	test('array arguments', () => {
		const command = input(['key1', 'key2', 'key3']);
		expect(command.args).toStrictEqual(['MGET', 'key1', 'key2', 'key3']);

		expect(command.replyTransform).toBeUndefined();
	});

	test('rest arguments', () => {
		const command = input('key1', 'key2', 'key3');
		expect(command.args).toStrictEqual(['MGET', 'key1', 'key2', 'key3']);

		expect(command.replyTransform).toBeUndefined();
	});
});
