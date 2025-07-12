import { expect, test } from 'vitest';
import { input } from './xlen.js';

test('command', () => {
	const command = input('mystream');
	expect(command.args).toStrictEqual(['XLEN', 'mystream']);

	expect(command.replyTransform).toBeUndefined();
});
