import {
	expect,
	test,
} from 'vitest';
import { input } from './incr.js';

test('command', () => {
	const command = input('key1');
	expect(
		command.args,
	).toStrictEqual(
		[ 'INCR', 'key1' ],
	);

	expect(command.replyTransform).toBeUndefined();
});
