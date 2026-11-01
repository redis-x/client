import { describe, expect, test } from 'vitest';
import { input } from './hstrlen.js';

describe('command', () => {
	test('arguments', () => {
		const command = input('myhash', 'field');
		expect(command.args).toStrictEqual(['HSTRLEN', 'myhash', 'field']);

		expect(command.replyTransform).toBeUndefined();
	});

	test('number field', () => {
		const command = input('myhash', 123);
		expect(command.args).toStrictEqual(['HSTRLEN', 'myhash', '123']);
	});
});
