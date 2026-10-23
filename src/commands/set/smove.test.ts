import { describe, expect, test } from 'vitest';
import { input } from './smove.js';

describe('command', () => {
	test('string member', () => {
		const command = input('myset', 'myotherset', 'two');
		expect(command.args).toStrictEqual(['SMOVE', 'myset', 'myotherset', 'two']);

		expect(command.replyTransform).toBeTypeOf('function');
	});

	test('numeric member', () => {
		const command = input('myset', 'myotherset', 2);
		expect(command.args).toStrictEqual(['SMOVE', 'myset', 'myotherset', '2']);
	});
});
