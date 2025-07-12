import { expect, test } from 'vitest';
import { input } from './exists.js';

test('command', () => {
	const command = input('key1', 'key2');
	expect(command.args).toStrictEqual(['EXISTS', 'key1', 'key2']);

	expect(command.replyTransform).toBeUndefined();
});
