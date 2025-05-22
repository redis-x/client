/* eslint-disable @stylistic/array-element-newline */

import {
	expect,
	test,
} from 'vitest';
import { input } from './rpoplpush.js';

test('command', () => {
	const command = input('source-list', 'dest-list');
	expect(
		command.args,
	).toStrictEqual(
		[ 'RPOPLPUSH', 'source-list', 'dest-list' ],
	);

	expect(command.replyTransform).toBeUndefined();
});
