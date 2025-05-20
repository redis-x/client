import {
	expect,
	test,
} from 'vitest';
import { input } from './getdel.js';

test('command', () => {
	const command = input('key1');
	expect(
		command.args,
	).toStrictEqual(
		[ 'GETDEL', 'key1' ],
	);

	expect(command.replyTransform).toBeUndefined();
});
