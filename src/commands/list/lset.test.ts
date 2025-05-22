/* eslint-disable @stylistic/array-element-newline */

import {
	describe,
	expect,
	test,
} from 'vitest';
import { input } from './lset.js';

describe('command', () => {
	test('positive index', () => {
		const command = input('mylist', 2, 'hello');
		expect(
			command.args,
		).toStrictEqual(
			[ 'LSET', 'mylist', '2', 'hello' ],
		);

		expect(command.replyTransform).toBeUndefined();
	});

	test('negative index', () => {
		const command = input('mylist', -1, 'world');
		expect(
			command.args,
		).toStrictEqual(
			[ 'LSET', 'mylist', '-1', 'world' ],
		);

		expect(command.replyTransform).toBeUndefined();
	});

	test('numeric element', () => {
		const command = input('mylist', 0, 42);
		expect(
			command.args,
		).toStrictEqual(
			[ 'LSET', 'mylist', '0', '42' ],
		);

		expect(command.replyTransform).toBeUndefined();
	});
});
