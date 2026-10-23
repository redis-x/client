import { describe, expect, test } from 'vitest';
import { input } from './zremrangebylex.js';

describe('command', () => {
	test('inclusive and exclusive bounds', () => {
		const command = input('myzset', '[alpha', '(omega');
		expect(command.args).toStrictEqual([
			'ZREMRANGEBYLEX',
			'myzset',
			'[alpha',
			'(omega',
		]);

		expect(command.replyTransform).toBeUndefined();
	});

	test('unbounded range', () => {
		const command = input('myzset', '-', '+');
		expect(command.args).toStrictEqual(['ZREMRANGEBYLEX', 'myzset', '-', '+']);
	});
});
