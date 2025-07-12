import { expect, test } from 'vitest';
import { input } from './incrby.js';

test('command', () => {
	const command = input('mykey', 5);
	expect(command.args).toStrictEqual(['INCRBY', 'mykey', '5']);

	expect(command.replyTransform).toBeUndefined();
});
