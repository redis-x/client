import { expect, test } from 'vitest';
import { input } from './hvals.js';

test('command', () => {
	const command = input('myhash');

	expect(command.args).toStrictEqual(['HVALS', 'myhash']);

	expect(command.replyTransform).toBeTypeOf('function');
});
