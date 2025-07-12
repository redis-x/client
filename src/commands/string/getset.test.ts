import { expect, test } from 'vitest';
import { input } from './getset.js';

test('command', () => {
	const command = input('mykey', 1);
	expect(command.args).toStrictEqual(['GETSET', 'mykey', '1']);

	expect(command.replyTransform).toBeUndefined();
});
