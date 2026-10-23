import { expect, test } from 'vitest';
import { doubleToNumber } from './double-to-number.js';

test('converts finite doubles to numbers', () => {
	expect(doubleToNumber('0')).toBe(0);
	expect(doubleToNumber('3')).toBe(3);
	expect(doubleToNumber('-2.5')).toBe(-2.5);
	expect(doubleToNumber('1.5e+300')).toBe(1.5e300);
});

test('converts infinite doubles to infinities', () => {
	expect(doubleToNumber('inf')).toBe(Infinity);
	expect(doubleToNumber('-inf')).toBe(-Infinity);
});
