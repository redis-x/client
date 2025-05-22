import {
	expect,
	test,
} from 'vitest';
import { input } from './hkeys.js';

test('command', () => {
	const command = input('myhash');
	expect(
		command.args,
	).toStrictEqual(
		[ 'HKEYS', 'myhash' ],
	);

	expect(command.replyTransform).toBeTypeOf('function');
});
