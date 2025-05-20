import {
	expect,
	test,
} from 'vitest';
import { input } from './decr.js';

test('command', () => {
	const command = input('key1');
	expect(
		command.args,
	).toStrictEqual(
		[ 'DECR', 'key1' ],
	);

	expect(command.replyTransform).toBeUndefined();
});
