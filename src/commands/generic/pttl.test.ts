import { expect, test } from 'vitest';
import { input } from './pttl.js';

test('command', () => {
	const command = input('key1');
	expect(command.args).toStrictEqual(['PTTL', 'key1']);

	expect(command.replyTransform).toBeUndefined();
});
