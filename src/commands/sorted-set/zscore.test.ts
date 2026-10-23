import { describe, expect, test } from 'vitest';
import { input } from './zscore.js';

test('command', () => {
	const command = input('key', 'member');
	expect(command.args).toStrictEqual(['ZSCORE', 'key', 'member']);
});

describe('reply', () => {
	test('score', () => {
		const command = input('key', 'member');
		expect(command.replyTransform!('1')).toStrictEqual(1);
	});

	test('missing member', () => {
		const command = input('key', 'member');
		expect(command.replyTransform!(null)).toBeNull();
	});
});
