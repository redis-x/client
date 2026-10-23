import { describe, expect, test } from 'vitest';
import { input } from './zscan.js';

describe('command', () => {
	test('cursor', () => {
		const command = input('myzset', 0);
		expect(command.args).toStrictEqual(['ZSCAN', 'myzset', '0']);
	});

	test('string cursor', () => {
		const command = input('myzset', '17');
		expect(command.args).toStrictEqual(['ZSCAN', 'myzset', '17']);
	});

	test('option MATCH', () => {
		const command = input('myzset', 0, { MATCH: 'f*' });
		expect(command.args).toStrictEqual(['ZSCAN', 'myzset', '0', 'MATCH', 'f*']);
	});

	test('option COUNT', () => {
		const command = input('myzset', 0, { COUNT: 100 });
		expect(command.args).toStrictEqual([
			'ZSCAN',
			'myzset',
			'0',
			'COUNT',
			'100',
		]);
	});

	test('all options', () => {
		const command = input('myzset', 0, { MATCH: 'f*', COUNT: 100 });
		expect(command.args).toStrictEqual([
			'ZSCAN',
			'myzset',
			'0',
			'MATCH',
			'f*',
			'COUNT',
			'100',
		]);
	});
});

describe('reply', () => {
	test('members and scores', () => {
		const command = input('myzset', 0);
		expect(
			command.replyTransform?.(['17', ['one', '1', 'two', '2.5']]),
		).toStrictEqual({
			cursor: '17',
			members: { one: 1, two: 2.5 },
		});
	});

	test('preserves __proto__ as an own data property', () => {
		const command = input('myzset', 0);
		const { members } =
			command.replyTransform?.(['0', ['__proto__', '1']]) ?? {};

		expect(Object.getPrototypeOf(members)).toBe(Object.prototype);
		expect(Object.entries(members ?? {})).toStrictEqual([['__proto__', 1]]);
	});
});
