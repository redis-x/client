/* eslint-disable @stylistic/array-element-newline */

import {
	expect,
	test,
} from 'vitest';
import { input } from './lrange.js';

test('command', () => {
	const command = input('mylist', 0, -2);
	expect(
		command.args,
	).toStrictEqual(
		[ 'LRANGE', 'mylist', '0', '-2' ],
	);

	expect(command.replyTransform).toBeUndefined();
});
