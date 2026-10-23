import { describe, expect, test } from 'vitest';
import { input } from './sunioncard.js';

describe('command', () => {
	test('one-shot iterator argument', () => {
		const command = input(['key1', 'key2'].values());
		expect(command.args).toStrictEqual(['SUNIONCARD', '2', 'key1', 'key2']);
	});

	test('keys', () => {
		const command = input(['key1', 'key2']);
		expect(command.args).toStrictEqual(['SUNIONCARD', '2', 'key1', 'key2']);

		expect(command.replyTransform).toBeUndefined();
	});

	test('option APPROX', () => {
		const command = input(['key1', 'key2'], { APPROX: true });
		expect(command.args).toStrictEqual([
			'SUNIONCARD',
			'2',
			'key1',
			'key2',
			'APPROX',
		]);
	});

	test('option APPROX disabled', () => {
		const command = input(['key1', 'key2'], { APPROX: false });
		expect(command.args).toStrictEqual(['SUNIONCARD', '2', 'key1', 'key2']);
	});

	test('option LIMIT', () => {
		const command = input(['key1', 'key2'], { LIMIT: 3 });
		expect(command.args).toStrictEqual([
			'SUNIONCARD',
			'2',
			'key1',
			'key2',
			'LIMIT',
			'3',
		]);
	});

	test('option LIMIT zero', () => {
		const command = input(['key1'], { LIMIT: 0 });
		expect(command.args).toStrictEqual([
			'SUNIONCARD',
			'1',
			'key1',
			'LIMIT',
			'0',
		]);
	});

	test('options APPROX and LIMIT', () => {
		const command = input(['key1', 'key2'], { APPROX: true, LIMIT: 100 });
		expect(command.args).toStrictEqual([
			'SUNIONCARD',
			'2',
			'key1',
			'key2',
			'APPROX',
			'LIMIT',
			'100',
		]);
	});
});
