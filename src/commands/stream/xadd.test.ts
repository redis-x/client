import { describe, expect, test } from 'vitest';
import { input } from './xadd.js';

describe('command', () => {
	test('no options', () => {
		const command = input('mystream', '*', { foo: 'bar', baz: 123 });
		expect(command.args).toStrictEqual([
			'XADD',
			'mystream',
			'*',
			'foo',
			'bar',
			'baz',
			'123',
		]);

		expect(command.replyTransform).toBeUndefined();
	});

	test('undefined in pairs', () => {
		const command = input('mystream', '*', { foo: 'bar', baz: undefined });
		expect(command.args).toStrictEqual(['XADD', 'mystream', '*', 'foo', 'bar']);

		expect(command.replyTransform).toBeUndefined();
	});

	test('option NOMKSTREAM', () => {
		const command = input(
			'mystream',
			'*',
			{ foo: 'bar' },
			{ NOMKSTREAM: true },
		);
		expect(command.args).toStrictEqual([
			'XADD',
			'mystream',
			'NOMKSTREAM',
			'*',
			'foo',
			'bar',
		]);
	});

	test('trimming', () => {
		const command = input(
			'mystream',
			'*',
			{ foo: 'bar' },
			{ trim: { strategy: 'MAXLEN', threshold: 1000 } },
		);
		expect(command.args).toStrictEqual([
			'XADD',
			'mystream',
			'MAXLEN',
			'1000',
			'*',
			'foo',
			'bar',
		]);
	});

	test('trimming with option MAXLEN', () => {
		const command = input(
			'mystream',
			'*',
			{ foo: 'bar' },
			{ trim: { strategy: 'MAXLEN', operator: '~', threshold: 1000 } },
		);
		expect(command.args).toStrictEqual([
			'XADD',
			'mystream',
			'MAXLEN',
			'~',
			'1000',
			'*',
			'foo',
			'bar',
		]);
	});

	test('trimming with option LIMIT', () => {
		const command = input(
			'mystream',
			'*',
			{ foo: 'bar' },
			{ trim: { strategy: 'MINID', threshold: 1000, LIMIT: 10 } },
		);
		expect(command.args).toStrictEqual([
			'XADD',
			'mystream',
			'MINID',
			'1000',
			'LIMIT',
			'10',
			'*',
			'foo',
			'bar',
		]);
	});
});
