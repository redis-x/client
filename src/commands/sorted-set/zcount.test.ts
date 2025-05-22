/* eslint-disable @stylistic/array-element-newline */

import {
	describe,
	expect,
	test,
} from 'vitest';
import { input } from './zcount.js';

describe('command', () => {
	test('numeric range', () => {
		const command = input('myzset', 1, 3);
		expect(
			command.args,
		).toStrictEqual(
			[ 'ZCOUNT', 'myzset', '1', '3' ],
		);

		expect(command.replyTransform).toBeUndefined();
	});

	test('infinity range', () => {
		const command = input('myzset', '-inf', '+inf');
		expect(
			command.args,
		).toStrictEqual(
			[ 'ZCOUNT', 'myzset', '-inf', '+inf' ],
		);
	});

	test('exclusive range', () => {
		const command = input('myzset', '(1', 3);
		expect(
			command.args,
		).toStrictEqual(
			[ 'ZCOUNT', 'myzset', '(1', '3' ],
		);
	});
});
