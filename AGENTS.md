# Working on @redis-x/client

`@redis-x/client` is a TypeScript wrapper around the `redis` package. It accepts an existing Redis client and adds typed commands, reply transformations, and transactions with named results. The package ships ESM and CommonJS builds with TypeScript declarations.

Read and follow [CONTRIBUTING.md](CONTRIBUTING.md) before making changes. It describes the project structure, command implementations and overloads, documentation requirements, tests, and code generation. See [README.md](README.md) for the public API and usage examples.

- Command implementations and their tests live in `src/commands/<category>/`.
- Command sections in `src/client.ts`, `src/transaction.ts`, and `src/transaction/use.ts` are generated. Update the command definitions and run `bun run build:lib`; never edit those sections manually.
- Install dependencies with `bun install`. Run `bun run build` to regenerate the client and build the package with tsdown.
- Run `bun run check` for code generation, linting, type checks, package validation, and tests under Vitest and Bun. Tests require Docker to start the local Redis instance.

Preserve runtime behavior, public types, transaction semantics, and published exports unless the task explicitly calls for a change.
