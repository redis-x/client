import { describe, expect, test } from 'vitest';
import { input } from './srem.js';

describe('command', () => {
	test('array arguments', () => {
		const command = input('myset', ['foo', 'bar', 1]);
		expect(command.args).toStrictEqual(['SREM', 'myset', 'foo', 'bar', '1']);

		expect(command.replyTransform).toBeUndefined();
	});

	test('rest arguments', () => {
		const command = input('myset', 'foo', 'bar', 1);
		expect(command.args).toStrictEqual(['SREM', 'myset', 'foo', 'bar', '1']);

		expect(command.replyTransform).toBeUndefined();
	});
});
