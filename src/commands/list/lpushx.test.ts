/* eslint-disable @stylistic/array-element-newline */

import {
	describe,
	expect,
	test,
} from 'vitest';
import { input } from './lpushx.js';

describe('command', () => {
	test('array arguments', () => {
		const command = input('mylist', [ 'Hello', 'World', 123 ]);
		expect(
			command.args,
		).toStrictEqual(
			[ 'LPUSHX', 'mylist', 'Hello', 'World', '123' ],
		);

		expect(command.replyTransform).toBeUndefined();
	});

	test('rest arguments', () => {
		const command = input('mylist', 'Hello', 'World', 123);
		expect(
			command.args,
		).toStrictEqual(
			[ 'LPUSHX', 'mylist', 'Hello', 'World', '123' ],
		);

		expect(command.replyTransform).toBeUndefined();
	});
});
