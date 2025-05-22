/* eslint-disable @stylistic/array-element-newline */

import {
	describe,
	expect,
	test,
} from 'vitest';
import { input } from './sadd.js';

describe('command', () => {
	test('array arguments', () => {
		const command = input('myset', [ 'foo', 'bar', 1 ]);
		expect(
			command.args,
		).toStrictEqual(
			[ 'SADD', 'myset', 'foo', 'bar', '1' ],
		);

		expect(command.replyTransform).toBeUndefined();
	});

	test('rest arguments', () => {
		const command = input('myset', 'foo', 'bar', 1);
		expect(
			command.args,
		).toStrictEqual(
			[ 'SADD', 'myset', 'foo', 'bar', '1' ],
		);

		expect(command.replyTransform).toBeUndefined();
	});
});
