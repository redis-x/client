import { describe, expect, test } from 'vitest';
import { input } from './hrandfield.js';

describe('command', () => {
	test('without count', () => {
		const command = input('coin');
		expect(command.args).toStrictEqual(['HRANDFIELD', 'coin']);
	});

	test('positive count', () => {
		const command = input('coin', 2);
		expect(command.args).toStrictEqual(['HRANDFIELD', 'coin', '2']);
	});

	test('negative count', () => {
		const command = input('coin', -5);
		expect(command.args).toStrictEqual(['HRANDFIELD', 'coin', '-5']);
	});

	test('option WITHVALUES', () => {
		const command = input('coin', -5, { WITHVALUES: true });
		expect(command.args).toStrictEqual([
			'HRANDFIELD',
			'coin',
			'-5',
			'WITHVALUES',
		]);
	});

	test('option WITHVALUES disabled', () => {
		const command = input('coin', 2, { WITHVALUES: false });
		expect(command.args).toStrictEqual(['HRANDFIELD', 'coin', '2']);
	});
});

describe('reply', () => {
	test('field without count', () => {
		const command = input('coin');
		expect(command.replyTransform!('heads')).toBe('heads');
		expect(command.replyTransform!(null)).toBeNull();
	});

	test('fields with count', () => {
		const command = input('coin', 2);
		expect(command.replyTransform!(['heads', 'tails'])).toStrictEqual([
			'heads',
			'tails',
		]);
	});

	test('fields with WITHVALUES disabled', () => {
		const command = input('coin', 2, { WITHVALUES: false });
		expect(command.replyTransform!(['heads', 'tails'])).toStrictEqual([
			'heads',
			'tails',
		]);
	});

	test('fields and values with WITHVALUES', () => {
		const command = input('coin', -2, { WITHVALUES: true });
		expect(
			command.replyTransform!(['heads', 'obverse', 'heads', 'obverse']),
		).toStrictEqual([
			{ field: 'heads', value: 'obverse' },
			{ field: 'heads', value: 'obverse' },
		]);
	});
});
