import { expect, test } from 'vitest';
import { input } from './psetex.js';

test('command', () => {
	const command = input('key1', 1000, 'value1');
	expect(command.args).toStrictEqual(['PSETEX', 'key1', '1000', 'value1']);

	expect(command.replyTransform).toBeUndefined();
});
