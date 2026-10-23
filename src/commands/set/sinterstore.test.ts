import { describe, expect, test } from 'vitest';
import { input } from './sinterstore.js';

describe('command', () => {
	test('rest arguments', () => {
		const command = input('destination', 'key1', 'key2');
		expect(command.args).toStrictEqual([
			'SINTERSTORE',
			'destination',
			'key1',
			'key2',
		]);

		expect(command.replyTransform).toBeUndefined();
	});

	test('collection argument', () => {
		const command = input('destination', ['key1', 'key2']);
		expect(command.args).toStrictEqual([
			'SINTERSTORE',
			'destination',
			'key1',
			'key2',
		]);
	});
});
