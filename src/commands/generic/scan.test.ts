import { describe, expect, test } from 'vitest';
import { input } from './scan.js';

describe('command', () => {
	test('cursor', () => {
		const command = input(0);
		expect(command.args).toStrictEqual(['SCAN', '0']);
	});

	test('string cursor', () => {
		const command = input('17');
		expect(command.args).toStrictEqual(['SCAN', '17']);
	});

	test('option MATCH', () => {
		const command = input(0, { MATCH: 'key:*' });
		expect(command.args).toStrictEqual(['SCAN', '0', 'MATCH', 'key:*']);
	});

	test('option COUNT', () => {
		const command = input(0, { COUNT: 100 });
		expect(command.args).toStrictEqual(['SCAN', '0', 'COUNT', '100']);
	});

	test('option TYPE', () => {
		const command = input(0, { TYPE: 'hash' });
		expect(command.args).toStrictEqual(['SCAN', '0', 'TYPE', 'hash']);
	});

	test('all options', () => {
		const command = input(0, { MATCH: 'key:*', COUNT: 100, TYPE: 'hash' });
		expect(command.args).toStrictEqual([
			'SCAN',
			'0',
			'MATCH',
			'key:*',
			'COUNT',
			'100',
			'TYPE',
			'hash',
		]);
	});
});

test('reply', () => {
	const command = input(0);
	expect(command.replyTransform?.(['17', ['key:1', 'key:2']])).toStrictEqual({
		cursor: '17',
		keys: new Set(['key:1', 'key:2']),
	});
});
