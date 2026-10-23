import { describe, expect, test } from 'vitest';
import { input } from './getex.js';

describe('command', () => {
	test('no options', () => {
		const command = input('key1');

		expect(command.args).toStrictEqual(['GETEX', 'key1']);

		expect(command.replyTransform).toBeUndefined();
	});

	test('option PERSIST', () => {
		const command = input('key1', { PERSIST: true });

		expect(command.args).toStrictEqual(['GETEX', 'key1', 'PERSIST']);
	});

	for (const option of ['EX', 'PX', 'EXAT', 'PXAT']) {
		test(`option ${option}`, () => {
			const command = input('key1', { [option]: 1000 });

			expect(command.args).toStrictEqual(['GETEX', 'key1', option, '1000']);
		});
	}
});
