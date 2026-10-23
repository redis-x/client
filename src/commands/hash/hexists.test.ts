import { describe, expect, test } from 'vitest';
import { input } from './hexists.js';

describe('command', () => {
	test('arguments', () => {
		const command = input('myhash', 'field1');
		expect(command.args).toStrictEqual(['HEXISTS', 'myhash', 'field1']);

		expect(command.replyTransform).toBeTypeOf('function');
	});

	test('number field', () => {
		const command = input('myhash', 123);
		expect(command.args).toStrictEqual(['HEXISTS', 'myhash', '123']);
	});
});
