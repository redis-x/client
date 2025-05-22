import {
	test,
	expect,
} from 'vitest';
import { input } from './keys.js';

test('command', () => {
	const command = input('foo*');

	expect(command.args).toStrictEqual(
		[ 'KEYS', 'foo*' ],
	);

	expect(command.replyTransform).toBeTypeOf('function');
});
