import {
	expect,
	test,
} from 'vitest';
import { input } from './expiretime.js';

test('command', () => {
	const command = input('key1');
	expect(
		command.args,
	).toStrictEqual(
		[ 'EXPIRETIME', 'key1' ],
	);

	expect(command.replyTransform).toBeUndefined();
});
