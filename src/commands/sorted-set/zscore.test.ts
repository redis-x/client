import { expect, test } from 'vitest';
import { input } from './zscore.js';

test('command', () => {
	const command = input('key', 'member');

	expect(command.args).toStrictEqual(['ZSCORE', 'key', 'member']);

	expect(command.replyTransform!('1')).toStrictEqual(1);
	expect(command.replyTransform!(null)).toBeNull();
});
