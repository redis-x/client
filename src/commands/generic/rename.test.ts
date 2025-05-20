/* eslint-disable @stylistic/array-element-newline */

import {
	expect,
	test,
} from 'vitest';
import { input } from './rename.js';

test('command', () => {
	const command = input('key1', 'key2');
	expect(
		command.args,
	).toStrictEqual(
		[ 'RENAME', 'key1', 'key2' ],
	);

	expect(command.replyTransform).toBeUndefined();
});
