/* eslint-disable @stylistic/array-element-newline */

import {
	expect,
	test,
	describe,
} from 'vitest';
import { input } from './ltrim.js';

describe('command', () => {
	test('positive indexes', () => {
		const command = input('mylist', 0, 2);
		expect(
			command.args,
		).toStrictEqual(
			[ 'LTRIM', 'mylist', '0', '2' ],
		);

		expect(command.replyTransform).toBeUndefined();
	});

	test('negative indexes', () => {
		const command = input('mylist', -3, -1);
		expect(
			command.args,
		).toStrictEqual(
			[ 'LTRIM', 'mylist', '-3', '-1' ],
		);

		expect(command.replyTransform).toBeUndefined();
	});
});
