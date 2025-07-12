import { expect, test } from 'vitest';
import { input } from './del.js';

test('command', () => {
	const command = input('key1', 'key2');
	expect(command.args).toStrictEqual(['DEL', 'key1', 'key2']);

	expect(command.replyTransform).toBeUndefined();
});
