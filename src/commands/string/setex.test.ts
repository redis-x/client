import { expect, test } from 'vitest';
import { input } from './setex.js';

test('command', () => {
	const command = input('key1', 60, 'value1');
	expect(command.args).toStrictEqual(['SETEX', 'key1', '60', 'value1']);

	expect(command.replyTransform).toBeUndefined();
});
