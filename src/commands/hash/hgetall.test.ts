import { expect, test } from 'vitest';
import { input } from './hgetall.js';

test('command', () => {
	const command = input('key');

	expect(command.args).toStrictEqual(['HGETALL', 'key']);

	expect(
		command.replyTransform!(['key1', 'value1', 'key2', 'value2']),
	).toStrictEqual({
		key1: 'value1',
		key2: 'value2',
	});
});
