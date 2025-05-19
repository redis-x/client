import {
	test,
	expect,
} from 'vitest';
import { input } from './eval.js';

test('EVAL', () => {
	const script = 'return {KEYS[1],ARGV[1]}';
	const command = input(
		script,
		[ 'foo' ],
		[ 'bar' ],
	);

	expect(command.args).toStrictEqual([
		'EVAL',
		script,
		'1',
		'foo',
		'bar',
	]);

	expect(command.replyTransform).toBeUndefined();
});
