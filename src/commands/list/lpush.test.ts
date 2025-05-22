import {
	expect,
	test,
} from 'vitest';
import { input } from './lpush.js';

test('command', () => {
	const command = input('key', 'apple', 'banana');

	expect(command.args).toStrictEqual([
		'LPUSH',
		'key',
		'apple',
		'banana',
	]);

	expect(command.replyTransform).toBeUndefined();
});
