/* eslint-disable @stylistic/array-element-newline */

import {
	expect,
	test,
	describe,
} from 'vitest';
import { input } from './hmset.js';

describe('command', () => {
	test('field-value arguments', () => {
		const command = input('myhash', 'foo', 'hello');
		expect(
			command.args,
		).toStrictEqual(
			[ 'HMSET', 'myhash', 'foo', 'hello' ],
		);

		expect(command.replyTransform).toBeUndefined();
	});

	test('field-value arguments with number', () => {
		const command = input('myhash', 'foo', 123);
		expect(
			command.args,
		).toStrictEqual(
			[ 'HMSET', 'myhash', 'foo', '123' ],
		);

		expect(command.replyTransform).toBeUndefined();
	});

	test('object argument', () => {
		const command = input('myhash', {
			foo: 'hello',
			bar: 123,
		});
		expect(
			command.args,
		).toStrictEqual(
			[ 'HMSET', 'myhash', 'foo', 'hello', 'bar', '123' ],
		);

		expect(command.replyTransform).toBeUndefined();
	});
});
