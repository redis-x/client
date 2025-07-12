import { expect, test } from 'vitest';
import { input } from './sismember.js';

test('command', () => {
	const command = input('myset', 'member1');
	expect(command.args).toStrictEqual(['SISMEMBER', 'myset', 'member1']);

	expect(command.replyTransform).toBeTypeOf('function');
});
