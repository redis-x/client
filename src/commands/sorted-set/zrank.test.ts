/* eslint-disable @stylistic/array-element-newline */

import {
	describe,
	expect,
	test,
} from 'vitest';
import { input } from './zrank.js';

describe('command', () => {
	test('command', () => {
		const command = input('key', 'member');

		expect(command.args).toStrictEqual([ 'ZRANK', 'key', 'member' ]);

		expect(command.replyTransform?.(1)).toStrictEqual(1);
		expect(command.replyTransform?.(null)).toBeNull();
	});

	test('command with WITHSCORE option', () => {
		const command = input('key', 'member', { WITHSCORE: true });

		expect(command.args).toStrictEqual([ 'ZRANK', 'key', 'member', 'WITHSCORE' ]);

		expect(command.replyTransform?.([ 2, '3.14' ])).toStrictEqual({
			rank: 2,
			score: 3.14,
		});
		expect(command.replyTransform?.(null)).toBeNull();
	});
});
