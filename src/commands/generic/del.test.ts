import { describe, expect, test } from 'vitest';
import { input } from './del.js';

describe('command', () => {
	test('rest arguments', () => {
		const command = input('key1', 'key2');
		expect(command.args).toStrictEqual(['DEL', 'key1', 'key2']);

		expect(command.replyTransform).toBeUndefined();
	});

	test('collection argument', () => {
		const command = input(['key1', 'key2']);
		expect(command.args).toStrictEqual(['DEL', 'key1', 'key2']);
	});
});
