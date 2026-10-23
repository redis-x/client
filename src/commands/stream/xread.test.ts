import { describe, expect, test } from 'vitest';
import { input } from './xread.js';

const zread_reply = [
	[
		'mystream',
		[
			['1526984818136-0', ['duration', '1532', 'event_id', '5']],
			['1526999352406-0', ['duration', '9526', 'event_id', '10']],
		],
	],
	[
		'writers',
		[
			['1526985676425-0', ['name', 'Peter', 'surname', 'McDonald']],
			['1526985679425-0', ['name', 'Elizabeth', 'surname', 'Taylor']],
		],
	],
];

const zread_return = {
	mystream: [
		{
			id: '1526984818136-0',
			data: {
				duration: '1532',
				event_id: '5',
			},
		},
		{
			id: '1526999352406-0',
			data: {
				duration: '9526',
				event_id: '10',
			},
		},
	],
	writers: [
		{
			id: '1526985676425-0',
			data: {
				name: 'Peter',
				surname: 'McDonald',
			},
		},
		{
			id: '1526985679425-0',
			data: {
				name: 'Elizabeth',
				surname: 'Taylor',
			},
		},
	],
};

describe('command', () => {
	test('single stream', () => {
		const command = input('mystream', '0-0');

		expect(command.args).toStrictEqual(['XREAD', 'STREAMS', 'mystream', '0-0']);

		expect(command.replyTransform?.(null)).toStrictEqual([]);
		expect(command.replyTransform?.(zread_reply.slice(0, 1))).toStrictEqual(
			zread_return.mystream,
		);
	});

	test('multiple streams', () => {
		const command = input({
			mystream: '0-0',
			writers: '194',
		});

		expect(command.args).toStrictEqual([
			'XREAD',
			'STREAMS',
			'mystream',
			'writers',
			'0-0',
			'194',
		]);

		expect(command.replyTransform?.(null)).toStrictEqual({
			mystream: [],
			writers: [],
		});
		expect(command.replyTransform?.(zread_reply)).toStrictEqual(zread_return);
	});

	describe('option BLOCK', () => {
		test('single stream', () => {
			const command = input('mystream', '0-0', { BLOCK: 1000 });

			expect(command.args).toStrictEqual([
				'XREAD',
				'BLOCK',
				'1000',
				'STREAMS',
				'mystream',
				'0-0',
			]);

			expect(command.replyTransform?.(null)).toStrictEqual([]);
			expect(command.replyTransform?.(zread_reply.slice(0, 1))).toStrictEqual(
				zread_return.mystream,
			);
		});

		test('multiple streams', () => {
			const command = input({ mystream: '0-0' }, { BLOCK: 1000 });

			expect(command.args).toStrictEqual([
				'XREAD',
				'BLOCK',
				'1000',
				'STREAMS',
				'mystream',
				'0-0',
			]);
		});
	});

	describe('option COUNT', () => {
		test('single stream', () => {
			const command = input('mystream', '0-0', { COUNT: 100 });

			expect(command.args).toStrictEqual([
				'XREAD',
				'COUNT',
				'100',
				'STREAMS',
				'mystream',
				'0-0',
			]);

			expect(command.replyTransform?.(null)).toStrictEqual([]);
			expect(command.replyTransform?.(zread_reply.slice(0, 1))).toStrictEqual(
				zread_return.mystream,
			);
		});

		test('multiple streams', () => {
			const command = input({ mystream: '0-0' }, { COUNT: 100 });

			expect(command.args).toStrictEqual([
				'XREAD',
				'COUNT',
				'100',
				'STREAMS',
				'mystream',
				'0-0',
			]);
		});
	});
});
