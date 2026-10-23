import { describe, expect, test } from 'vitest';
import { input } from './zincrby.js';

describe('command', () => {
	test('positive increment', () => {
		const command = input('myzset', 2, 'one');
		expect(command.args).toStrictEqual(['ZINCRBY', 'myzset', '2', 'one']);

		expect(command.replyTransform).toBeTypeOf('function');
	});

	test('negative fractional increment', () => {
		const command = input('myzset', -1.5, 'one');
		expect(command.args).toStrictEqual(['ZINCRBY', 'myzset', '-1.5', 'one']);
	});

	test('numeric member', () => {
		const command = input('myzset', 1, 10);
		expect(command.args).toStrictEqual(['ZINCRBY', 'myzset', '1', '10']);
	});
});
