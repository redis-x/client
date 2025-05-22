import {
	expect,
	test,
} from 'vitest';
import { input } from './zcard.js';

test('command', () => {
	const command = input('key');

	expect(
		command.args,
	).toStrictEqual(
		[ 'ZCARD', 'key' ],
	);

	expect(command.replyTransform).toBeUndefined();
});
