import { describe, expect, test } from 'vitest';
import { input } from './linsert.js';

describe('command', () => {
	test('option BEFORE', () => {
		const command = input('mylist', 'foo', { BEFORE: 'bar' });
		expect(command.args).toStrictEqual([
			'LINSERT',
			'mylist',
			'BEFORE',
			'bar',
			'foo',
		]);

		expect(command.replyTransform).toBeUndefined();
	});

	test('option AFTER', () => {
		const command = input('mylist', 'foo', { AFTER: 'bar' });
		expect(command.args).toStrictEqual([
			'LINSERT',
			'mylist',
			'AFTER',
			'bar',
			'foo',
		]);
	});

	test('numeric pivot and element', () => {
		const command = input('mylist', 1, { BEFORE: 0 });
		expect(command.args).toStrictEqual([
			'LINSERT',
			'mylist',
			'BEFORE',
			'0',
			'1',
		]);
	});

	test('both options are sent as given', () => {
		const command = input('mylist', 'foo', { BEFORE: 'bar', AFTER: 'baz' });
		expect(command.args).toStrictEqual([
			'LINSERT',
			'mylist',
			'BEFORE',
			'bar',
			'AFTER',
			'baz',
			'foo',
		]);
	});
});
