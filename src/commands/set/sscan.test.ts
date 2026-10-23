import { describe, expect, test } from 'vitest';
import { input } from './sscan.js';

describe('command', () => {
	test('cursor', () => {
		const command = input('myset', 0);
		expect(command.args).toStrictEqual(['SSCAN', 'myset', '0']);
	});

	test('string cursor', () => {
		const command = input('myset', '17');
		expect(command.args).toStrictEqual(['SSCAN', 'myset', '17']);
	});

	test('option MATCH', () => {
		const command = input('myset', 0, { MATCH: 'f*' });
		expect(command.args).toStrictEqual(['SSCAN', 'myset', '0', 'MATCH', 'f*']);
	});

	test('option COUNT', () => {
		const command = input('myset', 0, { COUNT: 100 });
		expect(command.args).toStrictEqual(['SSCAN', 'myset', '0', 'COUNT', '100']);
	});

	test('all options', () => {
		const command = input('myset', 0, { MATCH: 'f*', COUNT: 100 });
		expect(command.args).toStrictEqual([
			'SSCAN',
			'myset',
			'0',
			'MATCH',
			'f*',
			'COUNT',
			'100',
		]);
	});
});

test('reply', () => {
	const command = input('myset', 0);
	expect(command.replyTransform?.(['0', ['foo', 'foobar']])).toStrictEqual({
		cursor: '0',
		members: new Set(['foo', 'foobar']),
	});
});
