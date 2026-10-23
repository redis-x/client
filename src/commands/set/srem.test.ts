import { describe, expect, test } from 'vitest';
import { input } from './srem.js';

describe('command', () => {
	test('numeric first rest argument', () => {
		const command = input('myset', 0, 'foo');
		expect(command.args).toStrictEqual(['SREM', 'myset', '0', 'foo']);
	});

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
