import type { Command } from '../../types.js';

/**
 * This is a read-only variant of the `EVALSHA` command that cannot execute commands that modify data.
 * - Available since: 7.0.0.
 * - Time complexity: Depends on the script that is executed.
 * @param sha1 - The SHA1 digest of a read-only script previously cached with `SCRIPT LOAD` or `EVAL_RO`.
 * @param keys - The key names the script accesses, provided to it via the Lua `KEYS` global variable.
 * @param args - Additional arguments provided to the script via the Lua `ARGV` variable.
 * @returns The return value depends on the script that was executed.
 * @see {@link https://redis.io/commands/evalsha_ro}
 */
export function input(
	sha1: string,
	keys: (string | number)[],
	args?: (string | number)[],
): Command<unknown> {
	const command_args: string[] = [
		'EVALSHA_RO',
		sha1,
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
