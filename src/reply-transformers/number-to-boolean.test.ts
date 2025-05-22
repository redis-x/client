import {
	test,
	expect,
} from 'vitest';
import { replyTransform } from './number-to-boolean.js';

test(() => {
	expect(replyTransform(0)).toBe(false);
	expect(replyTransform(1)).toBe(true);
});
