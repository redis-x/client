/* eslint-disable @stylistic/array-element-newline */

import {
	expect,
	test,
} from 'vitest';
import { input } from './substr.js';

test('command', () => {
	const command = input('mykey', 0, -3);
	expect(
		command.args,
	).toStrictEqual(
		[ 'SUBSTR', 'mykey', '0', '-3' ],
	);

	expect(command.replyTransform).toBeUndefined();
});
