/* eslint-disable @stylistic/array-element-newline */

import {
	expect,
	test,
} from 'vitest';
import { input } from './append.js';

test('command', () => {
	const command = input('key1', 'value1');
	expect(
		command.args,
	).toStrictEqual(
		[ 'APPEND', 'key1', 'value1' ],
	);

	// No reply transform expected
	expect(command.replyTransform).toBeUndefined();
});
