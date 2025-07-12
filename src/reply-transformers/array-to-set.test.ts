import { expect, test } from 'vitest';
import { replyTransform } from './array-to-set.js';

test(() => {
	expect(replyTransform(['foo', 'bar', 'foo'])).toStrictEqual(
		new Set(['foo', 'bar']),
	);
});
