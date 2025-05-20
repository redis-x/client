/* eslint-disable @stylistic/array-element-newline */

import {
	expect,
	test,
} from 'vitest';
import { input } from './setnx.js';

test('command', () => {
	const command = input('key1', 'value1');
	expect(
		command.args,
	).toStrictEqual(
		[ 'SETNX', 'key1', 'value1' ],
	);

	expect(
		command.replyTransform?.(0),
	).toStrictEqual(false);

	expect(
		command.replyTransform?.(1),
	).toStrictEqual(true);
});
