# Contributing to redis-x

Thank you for your interest in contributing to redis-x! This document provides guidelines and instructions to make the contribution process smooth and effective for everyone involved.

## Code of Conduct

Please be respectful and considerate of others when contributing to this project. We aim to foster an open and welcoming environment.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/redis-x-client.git`
3. Install dependencies: `npm install` or `bun install`
4. Start local Redis instance: `bun run redis:up`
5. Make your changes
6. Run tests: `bun run test`
7. Submit a pull request

## Development Workflow

### Project Structure

- `src/` - Source code
  - `commands/` - Redis commands organized by category (generic, string, hash, etc.)
  - `client.ts` - Main client class (auto-generated)
  - `transaction.ts` - Transaction handling (auto-generated)
  - `transaction/use.ts` - Transaction use helper (auto-generated)
- `build/` - Build scripts for code generation
- `test/` - Test utilities

### Adding New Redis Commands

> [!IMPORTANT]
> Never manually modify the command sections in `src/client.ts`, `src/transaction.ts`, or `src/transaction/use.ts`. These files are auto-generated.

#### 1. Create the command implementation file

Add the file in the appropriate category directory under `src/commands/`. For example: `src/commands/generic/exists.ts` for the EXISTS command, or `src/commands/string/get.ts` for the GET command.

#### 2. Implement the command

The structure for implementing Redis commands follows these rules:

1. **Function Structure**:
  - Always define your implementation in `export function input(...)`.
  - The `input` function must return a `Command` type object.

2. **Overloads**:
  - If a command has multiple signatures, define them as `declare function _command(...)`.
  - The actual `input` function should handle all the overload cases.
  - The `_command` declarations return direct values, while the `input` function returns a `Command` object.

3. **Documentation**:
  - Documentation is mandatory for all commands.
  - Documentation should cite the Redis command reference, must include Redis version when the command was added and time complexity.
  - If there are NO overloads, document the `input` function with complete JSDoc.
  - If there ARE overloads, document each `_command` declaration instead.
  - If the command accepts an options object, document the options fields only in the exported options type, and **do not** reference it from the command documentation.

4. **Options**:
  - If a command accepts options, declare its type as `export type <CommandName>Options`.
  - The `export` keyword is mandatory for command options types.
  - Document every field in the options type with detailed JSDoc.

5. **Transformations**:
  - If you need to transform the Redis reply, implement a `replyTransform` function.
  - Use transformations to convert Redis responses to more developer-friendly structures.
  - **Prefer** `Set<T>` instead of arrays for unordered collections.
  - **Do not** use `Map<string, T>` instead of `Record<string, T>` for key-value pairs.

To see how to implement a command, refer to the existing commands in the `src/commands/` directory. Here are some examples:

- command with [no overloads](src/commands/string/get.ts);
- command with [reply transformation](src/commands/generic/keys.ts);
- command with [no overloads, but with options](src/commands/generic/expire.ts);
- command with [overloads](src/commands/string/set.ts).

#### Step 3. Add tests

Tests for command are mandatory. Create test file with the same name as the command file but with `.test.ts` extension alongside the command file. For example, if you create `src/commands/string/get.ts`, create `src/commands/string/get.test.ts`.

However, we **do not** test the Redis server itself. Instead, we test **transformations**:

- Command call should be transformed to the correct Redis command with options.
  - Test every option given to command.
  - [Example](src/commands/string/set.test.ts)
- The reply should be transformed to the correct type **only if** there is `replyTransform` defined.
  - [Example](src/commands/generic/keys.test.ts#L25)

#### Step 4. Generate the client code

After implementing your command, run `bun run build:lib`. This will generate the code for command in `src/client.ts`, `src/transaction.ts`, and `src/transaction/use.ts`.

#### Step 5. Check if everyting is good

To check if everything is good, run `bun run check`. This will compile the code, lint it with ESLint and TypeScript, and run the tests.

## Pull Request Process

1. Ensure your code passes all tests
2. Update documentation if necessary
3. Make sure you've run the code generator
4. Submit a pull request with a clear description of your changes

## Release Process

Releases are handled by the maintainers. The project follows semantic versioning (MAJOR.MINOR.PATCH).

## Questions?

If you have any questions or need help, please open an issue on GitHub.
