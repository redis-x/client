import {
	expect,
	test,
} from 'vitest';
import { input } from './llen.js';

test('command', () => {
	const command = input('mylist');
	expect(
		command.args,
	).toStrictEqual(
		[ 'LLEN', 'mylist' ],
	);

	expect(command.replyTransform).toBeUndefined();
});
