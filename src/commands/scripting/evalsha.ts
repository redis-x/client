import type { Command } from '../../types.js';

/**
 * Evaluate a script from the server's cache by its SHA1 digest.
 *
 * The server caches scripts by using the `SCRIPT LOAD` command.
 * The command is otherwise identical to `EVAL`.
 * - Available since: 2.6.0.
 * - Time complexity: Depends on the script that is executed.
 * @param sha1 - The SHA1 digest of a script previously cached with `SCRIPT LOAD` or `EVAL`.
 * @param keys - The key names the script accesses, provided to it via the Lua `KEYS` global variable.
 * @param args - Additional arguments provided to the script via the Lua `ARGV` variable.
 * @returns The return value depends on the script that was executed.
 * @see {@link https://redis.io/commands/evalsha}
 */
export function input(
	sha1: string,
	keys: (string | number)[],
	args?: (string | number)[],
): Command<unknown> {
	const command_args: string[] = [
		'EVALSHA',
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
