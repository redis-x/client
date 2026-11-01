import { describe, expect, test } from 'vitest';
import { input } from './hget.js';

describe('command', () => {
	test('arguments', () => {
		const command = input('key', 'field');
		expect(command.args).toStrictEqual(['HGET', 'key', 'field']);
	});

	test('number field', () => {
		const command = input('key', 123);
		expect(command.args).toStrictEqual(['HGET', 'key', '123']);
	});
});
