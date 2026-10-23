import type { Command } from '../../types.js';

/**
 * Runs a read-only Lua script. Unlike `EVAL`, this command can't run commands that modify data.
 * - Available since: 7.0.0.
 * - Time complexity: Depends on the script that is executed.
 * @param script - The Lua script to evaluate. It must not modify data.
 * @param keys - The key names the script accesses, provided to it via the Lua `KEYS` global variable.
 * @param args - Additional arguments provided to the script via the Lua `ARGV` variable.
 * @returns The return value depends on the script that was executed.
 * @see {@link https://redis.io/commands/eval_ro}
 */
export function input(
	script: string,
	keys: (string | number)[],
	args?: (string | number)[],
): Command<unknown> {
	const command_args: string[] = [
		'EVAL_RO',
		script,
		String(keys.length),
		...keys.map(String),
	];

	if (args) {
		command_args.push(...args.map(String));
	}

	return {
		kind: '#schema',
		args: command_args,
	};
}
