/* eslint-disable @stylistic/array-element-newline */

import {
	describe,
	expect,
	test,
} from 'vitest';
import { input } from './set.js';

test('SET', () => {
	const command = input('key', 'value');

	expect(command.args).toStrictEqual(
		[ 'SET', 'key', 'value' ],
	);

	expect(command.replyTransform).toBeUndefined();
});

for (const option of [ 'NX', 'XX', 'KEEPTTL' ]) {
	describe(`SET ${option}`, () => {
		for (const value of [ true, false ]) {
			test(String(value), () => {
				const command = input(
					'key',
					'value',
					{
						[option]: value,
					},
				);

				expect(command.args).toStrictEqual(
					value
						? [ 'SET', 'key', 'value', option ]
						: [ 'SET', 'key', 'value' ],
				);

				expect(command.replyTransform).toBeUndefined();
			});
		}
	});
}

for (const option of [ 'EX', 'PX', 'EXAT', 'PXAT' ]) {
	test(`SET ${option}`, () => {
		const command = input(
			'key',
			'value',
			{
				[option]: 1000,
			},
		);

		expect(command.args).toStrictEqual(
			[ 'SET', 'key', 'value', option, '1000' ],
		);

		expect(command.replyTransform).toBeUndefined();
	});
}

test('SET GET', () => {
	const command = input('key', 'value', { GET: true });

	expect(command.args).toStrictEqual([
		'SET',
		'key',
		'value',
		'GET',
	]);

	expect(command.replyTransform).toBeUndefined();
});
