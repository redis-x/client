import { expect, test } from 'vitest';
import { input } from './msetnx.js';

test('command', () => {
	const command = input({
		key1: 'value1',
		key2: 'value2',
	});

	expect(command.args).toStrictEqual([
		'MSETNX',
		'key1',
		'value1',
		'key2',
		'value2',
	]);

	expect(command.replyTransform).toBeTypeOf('function');
});
