import { expect, test } from 'vitest';
import { input } from './persist.js';

test('command', () => {
	const command = input('key1');
	expect(command.args).toStrictEqual(['PERSIST', 'key1']);

	expect(command.replyTransform).toBeTypeOf('function');
});
