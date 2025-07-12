import { expect, test } from 'vitest';
import { input } from './scard.js';

test('command', () => {
	const command = input('myset');
	expect(command.args).toStrictEqual(['SCARD', 'myset']);

	expect(command.replyTransform).toBeUndefined();
});
