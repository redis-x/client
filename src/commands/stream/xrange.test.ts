/* eslint-disable @stylistic/array-element-newline */

import {
	describe,
	expect,
	test,
} from 'vitest';
import { input } from './xrange.js';

describe('command', () => {
	test('no options', () => {
		const command = input('stream-key', '1526985054069-0', '1526985055069-0');

		expect(
			command.args,
		).toStrictEqual([
			'XRANGE',
			'stream-key',
			'1526985054069-0',
			'1526985055069-0',
		]);

		expect(command.replyTransform).toBeDefined();

		// Test transformer with sample data
		const transformed = command.replyTransform!([
			[ '1526985054069-0', [ 'name', 'Virginia', 'surname', 'Woolf' ]],
			[ '1526985055069-0', [ 'name', 'Jane', 'surname', 'Austen' ]],
		]);
		expect(transformed).toStrictEqual([
			{
				id: '1526985054069-0',
				data: {
					name: 'Virginia',
					surname: 'Woolf',
				},
			},
			{
				id: '1526985055069-0',
				data: {
					name: 'Jane',
					surname: 'Austen',
				},
			},
		]);
	});

	test('option COUNT', () => {
		const command = input('stream-key', '-', '+', { COUNT: 10 });

		expect(
			command.args,
		).toStrictEqual([
			'XRANGE',
			'stream-key',
			'-',
			'+',
			'COUNT',
			'10',
		]);

		expect(command.replyTransform).toBeDefined();
	});
});
