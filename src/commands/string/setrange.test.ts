import { expect, test } from 'vitest';
import { input } from './setrange.js';

test('command', () => {
	const command = input('key1', 6, 'Redis');
	expect(command.args).toStrictEqual(['SETRANGE', 'key1', '6', 'Redis']);

	// No reply transform expected
	expect(command.replyTransform).toBeUndefined();
});
