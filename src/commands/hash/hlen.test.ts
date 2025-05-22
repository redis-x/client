import {
	expect,
	test,
} from 'vitest';
import { input } from './hlen.js';

test('command', () => {
	const command = input('myhash');
	expect(
		command.args,
	).toStrictEqual(
		[ 'HLEN', 'myhash' ],
	);

	expect(command.replyTransform).toBeUndefined();
});
