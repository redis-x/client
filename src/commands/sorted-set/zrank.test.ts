import { describe, expect, test } from 'vitest';
import { input } from './zrank.js';

describe('command', () => {
	test('rank', () => {
		const command = input('myzset', 'three');
		expect(command.args).toStrictEqual(['ZRANK', 'myzset', 'three']);
	});

	test('numeric member', () => {
		const command = input('myzset', 1);
		expect(command.args).toStrictEqual(['ZRANK', 'myzset', '1']);
	});

	test('WITHSCORE option', () => {
		const command = input('myzset', 'three', { WITHSCORE: true });
		expect(command.args).toStrictEqual([
			'ZRANK',
			'myzset',
			'three',
			'WITHSCORE',
		]);
	});

	test('WITHSCORE disabled', () => {
		const command = input('myzset', 'three', { WITHSCORE: false });
		expect(command.args).toStrictEqual(['ZRANK', 'myzset', 'three']);
	});
});

describe('reply', () => {
	test('rank', () => {
		const command = input('myzset', 'three');
		expect(command.replyTransform!(2)).toBe(2);
		expect(command.replyTransform!(null)).toBeNull();
	});

	test('rank with WITHSCORE disabled', () => {
		const command = input('myzset', 'three', { WITHSCORE: false });
		expect(command.replyTransform!(2)).toBe(2);
		expect(command.replyTransform!(null)).toBeNull();
	});

	test('rank and score with WITHSCORE', () => {
		const command = input('myzset', 'three', { WITHSCORE: true });
		expect(command.replyTransform!([2, '3'])).toStrictEqual({
			rank: 2,
			score: 3,
		});
		expect(command.replyTransform!(null)).toBeNull();
	});
});
