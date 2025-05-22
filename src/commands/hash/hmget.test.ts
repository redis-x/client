/* eslint-disable @stylistic/array-element-newline */

import {
	describe,
	expect,
	test,
} from 'vitest';
import { input } from './hmget.js';

describe('command', () => {
	test('array arguments', () => {
		const command = input('myhash', [ 'field1', 'field2' ]);
		expect(
			command.args,
		).toStrictEqual(
			[ 'HMGET', 'myhash', 'field1', 'field2' ],
		);

		expect(command.replyTransform).toBeUndefined();
	});

	test('rest arguments', () => {
		const command = input('myhash', 'field1', 'field2');
		expect(
			command.args,
		).toStrictEqual(
			[ 'HMGET', 'myhash', 'field1', 'field2' ],
		);

		expect(command.replyTransform).toBeUndefined();
	});
});
