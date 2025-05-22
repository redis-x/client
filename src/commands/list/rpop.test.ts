/* eslint-disable @stylistic/array-element-newline */

import {
	expect,
	test,
	describe,
} from 'vitest';
import { input } from './rpop.js';

describe('command', () => {
	test('without count', () => {
		const command = input('mylist');
		expect(
			command.args,
		).toStrictEqual(
			[ 'RPOP', 'mylist' ],
		);

		expect(command.replyTransform).toBeUndefined();
	});

	test('with count', () => {
		const command = input('mylist', 2);
		expect(
			command.args,
		).toStrictEqual(
			[ 'RPOP', 'mylist', '2' ],
		);

		expect(command.replyTransform).toBeUndefined();
	});
});
