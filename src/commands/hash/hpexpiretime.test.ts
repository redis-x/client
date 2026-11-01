import { describe, expect, test } from 'vitest';
import { input } from './hpexpiretime.js';

describe('command', () => {
	test('collection argument', () => {
		const command = input('myhash', ['field1', 2]);
		expect(command.args).toStrictEqual([
			'HPEXPIRETIME',
			'myhash',
			'FIELDS',
			'2',
			'field1',
			'2',
		]);

		expect(command.replyTransform).toBeUndefined();
	});
});
