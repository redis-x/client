/* eslint-disable @stylistic/array-element-newline */

import {
	expect,
	test,
} from 'vitest';
import { input } from './incrbyfloat.js';

test('command', () => {
	const command = input('mykey', 0.1);
	expect(
		command.args,
	).toStrictEqual(
		[ 'INCRBYFLOAT', 'mykey', '0.1' ],
	);

	expect(command.replyTransform).toBeUndefined();
});
