/* eslint-disable @stylistic/array-element-newline */

import {
	expect,
	test,
} from 'vitest';
import { input } from './hexists.js';

test('command', () => {
	const command = input('myhash', 'field1');
	expect(
		command.args,
	).toStrictEqual(
		[ 'HEXISTS', 'myhash', 'field1' ],
	);

	expect(
		command.replyTransform?.(0),
	).toStrictEqual(false);

	expect(
		command.replyTransform?.(1),
	).toStrictEqual(true);
});

test('command with number field', () => {
	const command = input('myhash', 123);
	expect(
		command.args,
	).toStrictEqual(
		[ 'HEXISTS', 'myhash', '123' ],
	);
});
