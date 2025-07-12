import { describe, expect, test } from 'vitest';
import { input } from './zrangebylex.js';

describe('command', () => {
	test('range', () => {
		const command = input('myzset', '(a', '[c');
		expect(command.args).toStrictEqual(['ZRANGEBYLEX', 'myzset', '(a', '[c']);

		expect(command.replyTransform).toBeUndefined();
	});

	test('infinity', () => {
		const command = input('myzset', '-', '+');
		expect(command.args).toStrictEqual(['ZRANGEBYLEX', 'myzset', '-', '+']);

		expect(command.replyTransform).toBeUndefined();
	});

	test('option LIMIT', () => {
		const command = input('myzset', '[aaa', '(g', { LIMIT: [0, 10] });
		expect(command.args).toStrictEqual([
			'ZRANGEBYLEX',
			'myzset',
			'[aaa',
			'(g',
			'LIMIT',
			'0',
			'10',
		]);

		expect(command.replyTransform).toBeUndefined();
	});
});
