import { expect, test } from 'vitest';
import { input } from './ttl.js';

test('command', () => {
	const command = input('key1');
	expect(command.args).toStrictEqual(['TTL', 'key1']);

	expect(command.replyTransform).toBeUndefined();
});
