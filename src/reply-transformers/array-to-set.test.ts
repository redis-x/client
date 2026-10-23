import { expect, test } from 'vitest';
import { arrayToSet } from './array-to-set.js';

test('converts an array to a set of unique values', () => {
	expect(arrayToSet(['foo', 'bar', 'foo'])).toStrictEqual(
		new Set(['foo', 'bar']),
	);
});
