import { expect, test } from 'vitest';
import { input } from './strlen.js';

test('command', () => {
	const command = input('mykey');
	expect(command.args).toStrictEqual(['STRLEN', 'mykey']);

	// No reply transform expected
	expect(command.replyTransform).toBeUndefined();
});
