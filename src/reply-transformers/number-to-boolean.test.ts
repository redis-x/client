import { expect, test } from 'vitest';
import { numberToBoolean } from './number-to-boolean.js';

test('converts zero and one to booleans', () => {
	expect(numberToBoolean(0)).toBe(false);
	expect(numberToBoolean(1)).toBe(true);
});
