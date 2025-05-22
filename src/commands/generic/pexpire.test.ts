/* eslint-disable @stylistic/array-element-newline */

import {
	describe,
	expect,
	test,
} from 'vitest';
import { input } from './pexpire.js';

describe('command', () => {
	test('no options', () => {
		const command = input('key', 10);

		expect(command.args).toStrictEqual(
			[ 'PEXPIRE', 'key', '10' ],
		);

		expect(command.replyTransform).toBeTypeOf('function');
	});

	for (const option of [ 'NX', 'XX', 'GT', 'LT' ]) {
		describe(`option ${option}`, () => {
			for (const value of [ true, false ]) {
				test(String(value), () => {
					const command = input('key', 10, {
						[option]: value,
					});

					expect(command.args).toStrictEqual(
						value
							? [ 'PEXPIRE', 'key', '10', option ]
							: [ 'PEXPIRE', 'key', '10' ],
					);
				});
			}
		});
	}
});
