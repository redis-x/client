import {
	describe,
	expect,
	test,
} from 'vitest';
import { redisXClient } from '../../../test/client.js';
import { createRandomKey } from '../../../test/utils.js';
import { input } from './hget.js';

test('command', () => {
	const command = input('key', 'field');

	expect(command.args).toStrictEqual(
		[
			'HGET',
			'key',
			'field',
		],
	);

	expect(command.replyTransform).toBeUndefined();
});
