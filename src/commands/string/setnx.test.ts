import { expect, test } from 'vitest';
import { input } from './setnx.js';

test('command', () => {
	const command = input('key1', 'value1');
	expect(command.args).toStrictEqual(['SETNX', 'key1', 'value1']);

	expect(command.replyTransform).toBeTypeOf('function');
});
