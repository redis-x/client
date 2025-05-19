/* eslint-disable @stylistic/array-element-newline */

import {
	describe,
	expect,
	test,
} from 'vitest';
import { input } from './expire.js';

test('EXPIRE', () => {
	const command = input('key', 10);

	expect(command.args).toStrictEqual(
		[ 'EXPIRE', 'key', '10' ],
	);

	expect(command.replyTransform).toBeUndefined();
});

for (const option of [ 'NX', 'XX', 'GT', 'LT' ]) {
	describe(`EXPIRE ${option}`, () => {
		for (const value of [ true, false ]) {
			test(String(value), () => {
				const command = input('key', 10, {
					[option]: value,
				});

				expect(command.args).toStrictEqual(
					value
						? [ 'EXPIRE', 'key', '10', option ]
						: [ 'EXPIRE', 'key', '10' ],
				);
			});
		}
	});
}
