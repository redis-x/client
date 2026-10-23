import { describe, expect, test } from 'vitest';
import { input } from './zrevrank.js';

describe('command', () => {
	test('rank', () => {
		const command = input('myzset', 'one');
		expect(command.args).toStrictEqual(['ZREVRANK', 'myzset', 'one']);
	});

	test('numeric member', () => {
		const command = input('myzset', 1);
		expect(command.args).toStrictEqual(['ZREVRANK', 'myzset', '1']);
	});

	test('WITHSCORE option', () => {
		const command = input('myzset', 'three', { WITHSCORE: true });
		expect(command.args).toStrictEqual([
			'ZREVRANK',
			'myzset',
			'three',
			'WITHSCORE',
		]);
	});

	test('WITHSCORE disabled', () => {
		const command = input('myzset', 'one', { WITHSCORE: false });
		expect(command.args).toStrictEqual(['ZREVRANK', 'myzset', 'one']);
	});
});

describe('reply', () => {
	test('rank', () => {
		const command = input('myzset', 'one');
		expect(command.replyTransform!(2)).toBe(2);
		expect(command.replyTransform!(null)).toBeNull();
	});

	test('rank with WITHSCORE disabled', () => {
		const command = input('myzset', 'one', { WITHSCORE: false });
		expect(command.replyTransform!(2)).toBe(2);
		expect(command.replyTransform!(null)).toBeNull();
	});

	test('rank and score with WITHSCORE', () => {
		const command = input('myzset', 'three', { WITHSCORE: true });
		expect(command.replyTransform!([0, '3'])).toStrictEqual({
			rank: 0,
			score: 3,
		});
		expect(command.replyTransform!(null)).toBeNull();
	});
});
