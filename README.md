# redis-x

A strongly-typed Redis client built on top of the standard "redis" package, providing improved TypeScript support, intuitive transaction handling, and automatic data transformations.

## Features

- 🔒 **Strong TypeScript Support** - Full type safety for all Redis commands, parameters, and return values
- 🔄 **Enhanced Transactions** - Improved transaction support with named results and easier command chaining
- 🧩 **Smart Data Transformations** - Automatic conversion of Redis responses to appropriate JavaScript types
- 📦 **Compatibility** - Use with either import or require syntax
- 🔍 **Intuitive API** - Discover Redis commands through IDE autocomplete

## Installation

```bash
# Using bun
bun add @redis-x/client redis
# Using pnpm
pnpm add @redis-x/client redis
# Using npm
npm install @redis-x/client redis
```

Note: `redis-x` requires `redis` v4.6 or higher as a peer dependency.

## How to use

### Basic usage

```typescript
import { createClient } from 'redis';
import { RedisXClient } from '@redis-x/client';

// Create the standard Redis client
const redisClient = createClient({
  url: 'redis://localhost:6379'
});

// Wrap it with redis-x enhanced client
const client = new RedisXClient(redisClient);

// Connect to Redis
await redisClient.connect();

// Use the enhanced client
await client.SET('key', 'value');
const value = await client.GET('key');
console.log(value); // 'value'

// Close the connection
await redisClient.disconnect();
```

### Enhanced type safety

The client provides full type safety for command arguments and return values:

```typescript
// Properly typed arguments
const score = await client.ZSCORE('leaderboard', 'user123');
// score is typed as number | null

// Proper parameter typing
await client.EXPIRE('session', 3600, { NX: true });
// Options are properly typed, with IDE autocompletion
```

### Automatic data transformations

`redis-x` automatically transforms Redis responses into appropriate JavaScript types:

```typescript
// Standard Redis client returns arrays that need manual conversion
const hashFields = await client.HGETALL('user:123');
// Returns a properly typed object: { name: 'John', email: 'john@example.com' }

const keys = await client.KEYS('user:*');
// Returns a Set<string> instead of an array
```

### Better developer experience

Unlike the standard `redis` client, every command (and every option!) in `redis-x` is fully documented with Redis documentation, allowing you to easily understand each command's purpose and usage directly in your IDE.

#### `redis`

![Screenshot 2025-05-19 at 15 37 40](https://github.com/user-attachments/assets/13719296-e0a5-462c-b244-0537cd8a0395)
![Screenshot 2025-05-19 at 15 37 50](https://github.com/user-attachments/assets/222a3d83-f2e2-499f-a2f2-3d3ed26e068a)

#### `redis-x`
![Screenshot 2025-05-19 at 15 38 02](https://github.com/user-attachments/assets/458db310-8e1f-446e-a8e5-c2fe5ec271b5)
![Screenshot 2025-05-19 at 15 38 11](https://github.com/user-attachments/assets/3687799b-3097-400d-b4ee-3cd0b8c81758)


### Regular transactions

The standard `redis` client's transaction API works well but only supports type safety in version 5:

```typescript
const multi = client.MULTI()
  .GET('counter')
  .SET('last-updated', Date.now());
await multi.exec(); // Array<ReplyUnion>
await multi.exec<'typed'>(); // [string | null, string | null]
```

With `redis-x`, transactions are always fully typed:

```typescript
const transaction = client.createTransaction()
  .GET('counter')
  .SET('last-updated', Date.now());
await transaction.execute(); // [string | null, "OK" | null]
```

But `redis-x` goes beyond just typing with its more powerful transaction API...

### Transactions with named results

`redis-x` allows you to name the results of transaction commands, making them much easier to reference later.

With the standard `redis` client, you need to use array indexes to access specific command results:

```typescript
const multi = client.MULTI()
  .GET('counter')
  .SET('last-updated', Date.now());
const result = await multi.exec<'typed'>(); // [string | null, string | null]
const counter = result[0]; // string | null
```

This approach is error-prone if you later modify your transaction by adding or removing commands.

With `redis-x`, you can name your results using `as`:

```typescript
const transaction = await redisXClient.createTransaction()
  .GET('counter')
  .as('counter')
  .SET('last-updated', Date.now());
const result = transaction.execute(); //  [string | null, "OK" | null] & { foo: string | null }
const { counter } = result; // string | null
```

This naming system makes your code more readable and resilient to changes in transaction structure.

### Complex transaction logic

Let's look at a practical example using chat rooms. In our system, each room has:

- `id`: A unique identifier used in Redis keys
- `title`: The room name stored at `chats:<id>:title`
- `members`: A set of user IDs stored at `chats:<id>:members`

Imagine we need to fetch complete information for multiple chat rooms by their IDs. Here's how we would implement this:

#### With the standard `redis` client

```typescript
async function getChatRooms(roomIds: string[]) {
  const multi = redisClient.MULTI();

  // Add commands for each room
  for (const roomId of roomIds) {
    multi.GET(`chats:${roomId}:title`);
    multi.SMEMBERS(`chats:${roomId}:members`);
  }

  // Execute all commands
  const results = await multi.EXEC<'typed'>();

  // Process the flat array of results
  const rooms = [];
  for (let i = 0; i < results.length; i += 2) {
    const roomId = roomIds[i / 2];
    const title = results[i];
    const members = results[i + 1];

    rooms.push({
      id: roomId,
      title: title || null,
      members: members || []
    });
  }

  return rooms;
}
```

This approach works but has several drawbacks:
- We need to manually process the flat results array
- We must carefully track array indexes and maintain the `i += 2` pattern
- If we later modify the transaction to include more data per room, we'd need to update this index calculation
- It's easy to make mistakes when matching results back to room IDs

#### With `redis-x` client

```typescript
async function getChatRooms(roomIds: string[]) {
  return await redisXClient.createTransaction()
    .use((transaction) => {
      // Map each roomId to a structured room object
      return roomIds.map(roomId => ({
        id: roomId,
        title: transaction.GET(`chats:${roomId}:title`),
        members: transaction.SMEMBERS(`chats:${roomId}:members`)
      }));
    })
    .execute();
}
```

That shit is fully typed out of the box!

```typescript
function getChatRooms(roomIds: string[]): Promise<{
  id: string;
  title: string | null;
  members: Set<string>;
}[]>
```

The `redis-x` approach has significant advantages:

- The code directly expresses what we want: an array of room objects
- No need to handle complex index calculations or flatten/unflatten arrays
- Adding more room properties requires just adding new lines, not changing indexes
- The returned data structure is immediately usable without post-processing

So, the `use()` method is particularly powerful because:

- All commands executed on the `transaction` object are included in the Redis transaction
- You can include utility commands (like DEL) without cluttering your result structure
- The transaction construction supports full JavaScript logic, including conditionals, loops, and even **asynchronous code**
- You can return complex structures including nested objects and arrays

Note that after calling `use()`, the transaction result is no longer a tuple, so you won't be able to access results by index.

The `use()` method transforms complex Redis operations into clean, maintainable code that directly expresses your intent. All commands are still executed as a single atomic transaction, but the results come back organized exactly as you specified.

### Available commands

The `redis-x` client is more a proof of concept than a complete implementation. It currently supports a subset of Redis commands, but the full support for all commands is planned.

<!--
7 blocks:
- red means no support
- orange means at lease 33% support
- yellow at least 67%
- green at least 100%
(X/Y) / (1/7)
-->

| Section               | Commands available | Command names |
| --------------------- | - | - |
| Connection management | 🟥🟥🟥🟥🟥🟥🟥 <br> **0** / 32 | — |
| Generic               | 🟩🟥🟥🟥🟥🟥🟥 <br> **6** / 32 | `COPY` `DEL` `EXISTS` `EXPIRE` `EXPIRETIME` `KEYS` |
| Hash                  | 🟨🟥🟥🟥🟥🟥🟥 <br> **2** / 28 | `HGETALL` `HSET` |
| List                  | 🟥🟥🟥🟥🟥🟥🟥 <br> **1** / 22 | `LPUSH` |
| Scripting             | 🟨🟥🟥🟥🟥🟥🟥 <br> **1** / 19 | `EVAL` |
| Set                   | 🟥🟥🟥🟥🟥🟥🟥 <br> **0** / 17 | — |
| Sorted Set            | 🟩🟨🟥🟥🟥🟥🟥 <br> **6** / 35 | `ZADD` `ZCARD` `ZINTERSTORE` `ZRANGE` `ZREM` `ZSCORE` |
| String                | 🟨🟥🟥🟥🟥🟥🟥 <br> **2** / 22 | `GET` `SET` |
