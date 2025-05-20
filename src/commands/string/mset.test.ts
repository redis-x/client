/* eslint-disable @stylistic/array-element-newline */

import {
	expect,
	test,
} from 'vitest';
import { input } from './mset.js';

test('command', () => {
	const command = input({
		key1: 'value1',
		key2: 'value2',
	});

	expect(command.args).toStrictEqual([ 'MSET', 'key1', 'value1', 'key2', 'value2' ]);

	expect(command.replyTransform).toBeUndefined();
});
