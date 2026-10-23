import { describe, expect, test } from 'vitest';
import { input } from './exists.js';

describe('command', () => {
	test('rest arguments', () => {
		const command = input('key1', 'key2');
		expect(command.args).toStrictEqual(['EXISTS', 'key1', 'key2']);

		expect(command.replyTransform).toBeUndefined();
	});

	test('collection argument', () => {
		const command = input(['key1', 'key2']);
		expect(command.args).toStrictEqual(['EXISTS', 'key1', 'key2']);
	});
});
