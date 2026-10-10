import { expect, test } from 'vitest';
import { replyTransform } from './number-to-boolean.js';

test('converts zero and one to booleans', () => {
	expect(replyTransform(0)).toBe(false);
	expect(replyTransform(1)).toBe(true);
});
