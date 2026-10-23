import { describe, expect, test } from 'vitest';
import { input } from './srandmember.js';

describe('command', () => {
	test('without count', () => {
		const command = input('myset');
		expect(command.args).toStrictEqual(['SRANDMEMBER', 'myset']);

		expect(command.replyTransform).toBeUndefined();
	});

	test('positive count', () => {
		const command = input('myset', 2);
		expect(command.args).toStrictEqual(['SRANDMEMBER', 'myset', '2']);
	});

	test('negative count', () => {
		const command = input('myset', -5);
		expect(command.args).toStrictEqual(['SRANDMEMBER', 'myset', '-5']);
	});
});
