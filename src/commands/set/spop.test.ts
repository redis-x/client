import { describe, expect, test } from 'vitest';
import { input } from './spop.js';

describe('command', () => {
	test('without count', () => {
		const command = input('myset');
		expect(command.args).toStrictEqual(['SPOP', 'myset']);

		expect(command.replyTransform).toBeUndefined();
	});

	test('with count', () => {
		const command = input('myset', 3);
		expect(command.args).toStrictEqual(['SPOP', 'myset', '3']);

		expect(command.replyTransform).toBeTypeOf('function');
	});
});
