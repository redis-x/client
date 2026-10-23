import { describe, expect, test } from 'vitest';
import { input } from './sintercard.js';

describe('command', () => {
	test('one-shot iterator argument', () => {
		const command = input(['key1', 'key2'].values());
		expect(command.args).toStrictEqual(['SINTERCARD', '2', 'key1', 'key2']);
	});

	test('keys', () => {
		const command = input(['key1', 'key2']);
		expect(command.args).toStrictEqual(['SINTERCARD', '2', 'key1', 'key2']);

		expect(command.replyTransform).toBeUndefined();
	});

	test('option LIMIT', () => {
		const command = input(['key1', 'key2'], { LIMIT: 1 });
		expect(command.args).toStrictEqual([
			'SINTERCARD',
			'2',
			'key1',
			'key2',
			'LIMIT',
			'1',
		]);
	});

	test('option LIMIT zero', () => {
		const command = input(['key1'], { LIMIT: 0 });
		expect(command.args).toStrictEqual([
			'SINTERCARD',
			'1',
			'key1',
			'LIMIT',
			'0',
		]);
	});
});
