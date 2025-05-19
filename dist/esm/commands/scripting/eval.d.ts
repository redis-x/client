import type { Command } from '../../types.js';
/**
 * Invoke the execution of a server-side Lua script.
 * - Available since: 2.6.0.
 * - Time complexity: Depends on the script that is executed.
 * @param script Script's source code.
 * @param keys Keys accessed by the script.
 * @param args Arguments passed to the script.
 * @returns Value returned by the script.
 */
export declare function input(script: string, keys: (string | number)[], args?: (string | number)[]): Command<unknown>;
