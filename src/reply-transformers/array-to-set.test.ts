import { expect, test } from 'vitest';
import { replyTransform } from './array-to-set.js';

test('converts an array to a set of unique values', () => {
	expect(replyTransform(['foo', 'bar', 'foo'])).toStrictEqual(
		new Set(['foo', 'bar']),
	);
});
