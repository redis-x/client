import { describe, expect, test } from 'vitest';
import { input } from './xdel.js';

describe('command', () => {
	test('array arguments', () => {
		const command = input('mystream', ['1538561698944-0', '1538561700640-0']);
		expect(command.args).toStrictEqual([
			'XDEL',
			'mystream',
			'1538561698944-0',
			'1538561700640-0',
		]);

		expect(command.replyTransform).toBeUndefined();
	});

	test('rest arguments', () => {
		const command = input('mystream', '1538561698944-0', '1538561700640-0');
		expect(command.args).toStrictEqual([
			'XDEL',
			'mystream',
			'1538561698944-0',
			'1538561700640-0',
		]);

		expect(command.replyTransform).toBeUndefined();
	});
});
