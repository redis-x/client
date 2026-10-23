import { describe, expect, test } from 'vitest';
import { input } from './xtrim.js';

describe('command', () => {
	test('MAXLEN', () => {
		const command = input('mystream', 'MAXLEN', 1000);

		expect(command.args).toStrictEqual(['XTRIM', 'mystream', 'MAXLEN', '1000']);

		expect(command.replyTransform).toBeUndefined();
	});

	test('MINID', () => {
		const command = input('mystream', 'MINID', '649085820-0');

		expect(command.args).toStrictEqual([
			'XTRIM',
			'mystream',
			'MINID',
			'649085820-0',
		]);

		expect(command.replyTransform).toBeUndefined();
	});

	describe('option trimOperator', () => {
		test('~', () => {
			const command = input('mystream', 'MAXLEN', 1000, {
				trimOperator: '~',
			});

			expect(command.args).toStrictEqual([
				'XTRIM',
				'mystream',
				'MAXLEN',
				'~',
				'1000',
			]);

			expect(command.replyTransform).toBeUndefined();
		});

		test('=', () => {
			const command = input('mystream', 'MAXLEN', 1000, {
				trimOperator: '=',
			});

			expect(command.args).toStrictEqual([
				'XTRIM',
				'mystream',
				'MAXLEN',
				'=',
				'1000',
			]);

			expect(command.replyTransform).toBeUndefined();
		});
	});

	test('option LIMIT', () => {
		const command = input('mystream', 'MAXLEN', 1000, {
			LIMIT: 500,
		});

		expect(command.args).toStrictEqual([
			'XTRIM',
			'mystream',
			'MAXLEN',
			'1000',
			'LIMIT',
			'500',
		]);

		expect(command.replyTransform).toBeUndefined();
	});

	test('multiple options', () => {
		const command = input('mystream', 'MINID', '649085820-0', {
			trimOperator: '~',
			LIMIT: 100,
		});

		expect(command.args).toStrictEqual([
			'XTRIM',
			'mystream',
			'MINID',
			'~',
			'649085820-0',
			'LIMIT',
			'100',
		]);

		expect(command.replyTransform).toBeUndefined();
	});
});
