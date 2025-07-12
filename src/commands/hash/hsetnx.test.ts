import { describe, expect, test } from 'vitest';
import { input } from './hsetnx.js';

describe('command', () => {
	test('string value', () => {
		const command = input('myhash', 'field', 'value');
		expect(command.args).toStrictEqual(['HSETNX', 'myhash', 'field', 'value']);

		expect(command.replyTransform).toBeTypeOf('function');
	});

	test('number value', () => {
		const command = input('myhash', 'count', 42);
		expect(command.args).toStrictEqual(['HSETNX', 'myhash', 'count', '42']);

		expect(command.replyTransform).toBeTypeOf('function');
	});
});
