import { describe, expect, test } from 'vitest';
import { input } from './xadd.js';

const pairs = { foo: 'bar' };

/**
 * Builds the expected arguments for adding `pairs` to `mystream`.
 * @param options Arguments expected between the key and the entry ID.
 * @returns Expected command arguments.
 */
function expectedArgs(...options: string[]): string[] {
	return ['XADD', 'mystream', ...options, '*', 'foo', 'bar'];
}

describe('command', () => {
	test('no options', () => {
		const command = input('mystream', '*', { foo: 'bar', baz: 123 });
		expect(command.args).toStrictEqual([...expectedArgs(), 'baz', '123']);

		expect(command.replyTransform).toBeUndefined();
	});

	test('undefined in pairs', () => {
		const command = input('mystream', '*', { foo: 'bar', baz: undefined });
		expect(command.args).toStrictEqual(expectedArgs());

		expect(command.replyTransform).toBeUndefined();
	});

	test('trimming', () => {
		const command = input('mystream', '*', pairs, {
			trim: { strategy: 'MAXLEN', threshold: 1000 },
		});
		expect(command.args).toStrictEqual(expectedArgs('MAXLEN', '1000'));
	});

	test('trimming with option MAXLEN', () => {
		const command = input('mystream', '*', pairs, {
			trim: { strategy: 'MAXLEN', operator: '~', threshold: 1000 },
		});
		expect(command.args).toStrictEqual(expectedArgs('MAXLEN', '~', '1000'));
	});

	test('trimming with option LIMIT', () => {
		const command = input('mystream', '*', pairs, {
			trim: { strategy: 'MINID', threshold: 1000, LIMIT: 10 },
		});
		expect(command.args).toStrictEqual(
			expectedArgs('MINID', '1000', 'LIMIT', '10'),
		);
	});

	describe('option NOMKSTREAM', () => {
		for (const nomkstream of [true, false]) {
			const flag = nomkstream ? ['NOMKSTREAM'] : [];

			test(String(nomkstream), () => {
				const command = input('mystream', '*', pairs, {
					NOMKSTREAM: nomkstream,
				});
				expect(command.args).toStrictEqual(expectedArgs(...flag));
			});

			test(`${nomkstream} with trimming`, () => {
				const command = input('mystream', '*', pairs, {
					NOMKSTREAM: nomkstream,
					trim: {
						strategy: 'MAXLEN',
						operator: '~',
						threshold: 1000,
						LIMIT: 10,
					},
				});
				expect(command.args).toStrictEqual(
					expectedArgs(...flag, 'MAXLEN', '~', '1000', 'LIMIT', '10'),
				);
			});
		}
	});
});
