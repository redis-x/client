/* eslint-disable @stylistic/array-element-newline */

import {
	describe,
	expect,
	test,
} from 'vitest';
import { input } from './copy.js';

describe('command', () => {
	test('no options', () => {
		const command = input('key:before', 'key:after');

		expect(command.args).toStrictEqual(
			[ 'COPY', 'key:before', 'key:after' ],
		);

		expect(command.replyTransform?.(0)).toBe(false);
		expect(command.replyTransform?.(1)).toBe(true);
	});

	test('option DB', () => {
		const command = input('key:before', 'key:after', { DB: 2 });

		expect(command.args).toStrictEqual(
			[ 'COPY', 'key:before', 'key:after', 'DB', '2' ],
		);
	});

	test('option REPLACE', () => {
		const command = input('key:before', 'key:after', { REPLACE: true });

		expect(command.args).toStrictEqual(
			[ 'COPY', 'key:before', 'key:after', 'REPLACE' ],
		);
	});
});
