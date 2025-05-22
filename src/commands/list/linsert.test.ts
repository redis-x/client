/* eslint-disable @stylistic/array-element-newline */

import {
	describe,
	expect,
	test,
} from 'vitest';
import { input } from './linsert.js';

describe('command', () => {
	test('option BEFORE', () => {
		const command = input('mylist', 'foo', { BEFORE: 'bar' });
		expect(
			command.args,
		).toStrictEqual(
			[ 'LINSERT', 'mylist', 'BEFORE', 'bar', 'foo' ],
		);

		expect(command.replyTransform).toBeUndefined();
	});

	test('option AFTER', () => {
		const command = input('mylist', 'foo', { AFTER: 'bar' });
		expect(
			command.args,
		).toStrictEqual(
			[ 'LINSERT', 'mylist', 'AFTER', 'bar', 'foo' ],
		);

		expect(command.replyTransform).toBeUndefined();
	});
});
