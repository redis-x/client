/* eslint-disable @stylistic/array-element-newline */

import {
	test,
	expect,
} from 'vitest';
import { input } from './del.js';

test('DEL', () => {
	const command = input('key1', 'key2');
	expect(
		command.args,
	).toStrictEqual(
		[ 'DEL', 'key1', 'key2' ],
	);

	expect(command.replyTransform).toBeUndefined();
});
