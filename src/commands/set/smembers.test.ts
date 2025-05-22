import {
	expect,
	test,
} from 'vitest';
import { input } from './smembers.js';

test('command', () => {
	const command = input('myset');
	expect(
		command.args,
	).toStrictEqual(
		[ 'SMEMBERS', 'myset' ],
	);

	expect(command.replyTransform).toBeTypeOf('function');
});
