import { expect, test } from 'vitest';
import { input } from './renamenx.js';

test('command', () => {
	const command = input('key1', 'key2');
	expect(command.args).toStrictEqual(['RENAMENX', 'key1', 'key2']);

	expect(command.replyTransform).toBeUndefined();
});
