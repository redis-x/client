import { expect, test } from 'vitest';
import { input } from './pexpiretime.js';

test('command', () => {
	const command = input('key1');
	expect(command.args).toStrictEqual(['PEXPIRETIME', 'key1']);

	expect(command.replyTransform).toBeUndefined();
});
