/* eslint-disable @stylistic/array-element-newline */

import {
	expect,
	test,
} from 'vitest';
import { input } from './decrby.js';

test('command', () => {
	const command = input('key1', 5);
	expect(
		command.args,
	).toStrictEqual(
		[ 'DECRBY', 'key1', '5' ],
	);

	expect(command.replyTransform).toBeUndefined();
});
