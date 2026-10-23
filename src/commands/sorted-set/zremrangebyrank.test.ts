import { describe, expect, test } from 'vitest';
import { input } from './zremrangebyrank.js';

describe('command', () => {
	test('positive indexes', () => {
		const command = input('myzset', 0, 1);
		expect(command.args).toStrictEqual(['ZREMRANGEBYRANK', 'myzset', '0', '1']);

		expect(command.replyTransform).toBeUndefined();
	});

	test('negative indexes', () => {
		const command = input('myzset', -2, -1);
		expect(command.args).toStrictEqual([
			'ZREMRANGEBYRANK',
			'myzset',
			'-2',
			'-1',
		]);
	});
});
