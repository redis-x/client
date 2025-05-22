/* eslint-disable @stylistic/array-element-newline */

import {
	test,
	expect,
} from 'vitest';
import { replyTransform } from './array-to-set.js';

test(() => {
	expect(replyTransform([ 'foo', 'bar', 'foo' ])).toStrictEqual(new Set([ 'foo', 'bar' ]));
});
