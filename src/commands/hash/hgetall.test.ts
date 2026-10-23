import { expect, test } from 'vitest';
import { input } from './hgetall.js';

test('command', () => {
	const command = input('key');

	expect(command.args).toStrictEqual(['HGETALL', 'key']);

	expect(command.replyTransform).toBeTypeOf('function');
});
