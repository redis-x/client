# Working on @redis-x/client

`@redis-x/client` is a TypeScript wrapper around the `redis` package. It accepts an existing Redis client and adds typed commands, reply transformations, and transactions with named results. The package ships ESM and CommonJS builds with TypeScript declarations.

Read and follow [CONTRIBUTING.md](CONTRIBUTING.md) before making changes. It describes the project structure, command implementations and overloads, documentation requirements, tests, and code generation. See [README.md](README.md) for the public API and usage examples.

- Command implementations and their tests live in `src/commands/<category>/`.
- The command progress table in `README.md` counts commands from the Redis version named above it (currently 8.10). When you add a command, update its row's count and progress blocks. When moving to a newer Redis version, change that version and its reference link, then recount every row's total.
- Command sections in `src/client.ts`, `src/transaction.ts`, and `src/transaction/use.ts` are generated. Update the command definitions and run `bun run build:lib`; never edit those sections manually.
- Install dependencies with `bun install`. Run `bun run build` to regenerate the client and build the package with tsdown.
- Run `bun run check` for code generation, linting, type checks, package validation, and tests under Vitest and Bun. Tests require Docker to start the local Redis instance.

Preserve runtime behavior, public types, transaction semantics, and published exports unless the task explicitly calls for a change.
