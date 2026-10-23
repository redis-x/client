import { expect, test } from 'vitest';
import { input } from './get.js';

test('command', () => {
	const command = input('key');

	expect(command.args).toStrictEqual(['GET', 'key']);

	expect(command.replyTransform).toBeUndefined();
});
