import { expect, test } from 'vitest';
import { input } from './hstrlen.js';

test('command', () => {
	const command = input('myhash', 'field');
	expect(command.args).toStrictEqual(['HSTRLEN', 'myhash', 'field']);

	expect(command.replyTransform).toBeUndefined();
});
