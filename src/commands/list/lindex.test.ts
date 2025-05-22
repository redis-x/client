/* eslint-disable @stylistic/array-element-newline */

import {
	expect,
	test,
} from 'vitest';
import { input } from './lindex.js';

test('command', () => {
	const command = input('mylist', 0);
	expect(
		command.args,
	).toStrictEqual(
		[ 'LINDEX', 'mylist', '0' ],
	);

	expect(command.replyTransform).toBeUndefined();
});
