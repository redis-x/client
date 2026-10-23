import { describe, expect, test } from 'vitest';
import { input } from './hscan.js';

describe('command', () => {
	test('cursor', () => {
		const command = input('myhash', 0);
		expect(command.args).toStrictEqual(['HSCAN', 'myhash', '0']);
	});

	test('string cursor', () => {
		const command = input('myhash', '17');
		expect(command.args).toStrictEqual(['HSCAN', 'myhash', '17']);
	});

	test('option MATCH', () => {
		const command = input('myhash', 0, { MATCH: 'f*' });
		expect(command.args).toStrictEqual(['HSCAN', 'myhash', '0', 'MATCH', 'f*']);
	});

	test('option COUNT', () => {
		const command = input('myhash', 0, { COUNT: 100 });
		expect(command.args).toStrictEqual([
			'HSCAN',
			'myhash',
			'0',
			'COUNT',
			'100',
		]);
	});

	describe('option NOVALUES', () => {
		for (const value of [true, false]) {
			test(String(value), () => {
				const command = input('myhash', 0, { NOVALUES: value });
				expect(command.args).toStrictEqual(
					value
						? ['HSCAN', 'myhash', '0', 'NOVALUES']
						: ['HSCAN', 'myhash', '0'],
				);
			});
		}
	});

	test('all options', () => {
		const command = input('myhash', 0, {
			MATCH: 'f*',
			COUNT: 100,
			NOVALUES: true,
		});
		expect(command.args).toStrictEqual([
			'HSCAN',
			'myhash',
			'0',
			'MATCH',
			'f*',
			'COUNT',
			'100',
			'NOVALUES',
		]);
	});
});

describe('reply', () => {
	test('NOVALUES omitted', () => {
		const command = input('myhash', 0);
		expect(
			command.replyTransform?.(['17', ['field1', 'a', 'field2', 'b']]),
		).toStrictEqual({
			cursor: '17',
			fields: { field1: 'a', field2: 'b' },
		});
	});

	test('NOVALUES false', () => {
		const command = input('myhash', 0, { NOVALUES: false });
		expect(command.replyTransform?.(['0', ['field1', 'a']])).toStrictEqual({
			cursor: '0',
			fields: { field1: 'a' },
		});
	});

	test('NOVALUES true', () => {
		const command = input('myhash', 0, { NOVALUES: true });
		expect(command.replyTransform?.(['0', ['field1', 'field2']])).toStrictEqual(
			{
				cursor: '0',
				fields: new Set(['field1', 'field2']),
			},
		);
	});
});
