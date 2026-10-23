import { describe, expect, test } from 'vitest';
import { input } from './evalsha.js';

const sha1 = 'b0d697da25b13e49157b2c214a4033546aba2104';

describe('command', () => {
	test('keys and arguments', () => {
		const command = input(sha1, ['foo', 1], ['bar', 2]);
		expect(command.args).toStrictEqual([
			'EVALSHA',
			sha1,
			'2',
			'foo',
			'1',
			'bar',
			'2',
		]);

		expect(command.replyTransform).toBeUndefined();
	});

	test('keys without arguments', () => {
		const command = input(sha1, []);
		expect(command.args).toStrictEqual(['EVALSHA', sha1, '0']);
	});
});
