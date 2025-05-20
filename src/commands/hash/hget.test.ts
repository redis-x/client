/* eslint-disable @stylistic/array-element-newline */

import {
	expect,
	test,
} from 'vitest';
import { input } from './hget.js';

test('command', () => {
	const command = input('key', 'field');

	expect(command.args).toStrictEqual(
		[ 'HGET', 'key', 'field' ],
	);
});
