import { describe, expect, test } from 'vitest';
import { input } from './zrevrangebylex.js';

describe('command', () => {
	test('range', () => {
		const command = input('myzset', '[c', '(a');
		expect(command.args).toStrictEqual([
			'ZREVRANGEBYLEX',
			'myzset',
			'[c',
			'(a',
		]);

		expect(command.replyTransform).toBeUndefined();
	});

	test('unbounded range', () => {
		const command = input('myzset', '+', '-');
		expect(command.args).toStrictEqual(['ZREVRANGEBYLEX', 'myzset', '+', '-']);
	});

	test('option LIMIT', () => {
		const command = input('myzset', '(g', '[aaa', { LIMIT: [1, -1] });
		expect(command.args).toStrictEqual([
			'ZREVRANGEBYLEX',
			'myzset',
			'(g',
			'[aaa',
			'LIMIT',
			'1',
			'-1',
		]);
	});
});
