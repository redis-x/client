import {
	expect,
	test,
} from 'vitest';
import { input } from './type.js';

test('command', () => {
	const command = input('key');
	expect(
		command.args,
	).toStrictEqual(
		[ 'TYPE', 'key' ],
	);

	expect(command.replyTransform).toBeUndefined();
});
