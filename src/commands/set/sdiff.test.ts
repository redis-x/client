import { describe, expect, test } from 'vitest';
import { input } from './sdiff.js';

describe('command', () => {
	test('rest arguments', () => {
		const command = input('key1', 'key2', 'key3');
		expect(command.args).toStrictEqual(['SDIFF', 'key1', 'key2', 'key3']);

		expect(command.replyTransform).toBeTypeOf('function');
	});

	test('collection argument', () => {
		const command = input(['key1', 'key2']);
		expect(command.args).toStrictEqual(['SDIFF', 'key1', 'key2']);
	});
});
