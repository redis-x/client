# Command fixes and updates

Audit baseline: the [Redis 8.10 command reference](https://redis.io/docs/latest/commands/redis-8-10-commands/), checked October 10, 2026. This backlog covers commands already implemented by this client. Commands without dedicated wrappers are outside its scope.

Findings come from reviewing all 89 command implementations against their individual Redis references, with local serialization, transformation, and TypeScript inference probes. They have not been validated by integration tests against Redis 8.10.

When implementing an item, follow [CONTRIBUTING.md](CONTRIBUTING.md), change the command definitions, and regenerate the client and transaction APIs with `bun run build:lib`. Changes to public result shapes require a compatibility decision. The current test setup uses Redis 7; validation of Redis 8 features will need an appropriate server version.

Item IDs are permanent. Remove completed entries without renumbering the remaining entries or reusing retired IDs. Assign new entries the next unused ID in their category and advance the corresponding counter below.

Next IDs: **1.12** and **2.7**.

## 1. Invalid or incomplete implementations

1.7. **XADD NOMKSTREAM: preserve nullability when options are stored in a variable.**
  [Implementation](src/commands/stream/xadd.ts) · [Redis reference](https://redis.io/docs/latest/commands/xadd/)
  A variable containing both `NOMKSTREAM: true` and `trim` can select the overload returning `string`. Redis returns `null` if the stream does not exist. Ensure the generated APIs retain that possibility.

1.9. **Stream commands: provide a lossless representation for repeated fields.**
  [XADD](src/commands/stream/xadd.ts) · [XRANGE](src/commands/stream/xrange.ts) · [XREVRANGE](src/commands/stream/xrevrange.ts) · [XREAD](src/commands/stream/xread.ts) · [Redis reference](https://redis.io/docs/latest/commands/xread/)
  `XADD` accepts a record, so it cannot represent repeated field names. The readers also convert field/value pairs into records, overwriting earlier occurrences. Decide how to expose ordered pairs without silently losing data or unexpectedly breaking existing callers.

1.10. **Existing commands: decide and implement binary-safe argument and reply support.**
  [Command types](src/types.ts) · [Client transport](src/client.ts) · [Redis strings](https://redis.io/docs/latest/develop/data-types/strings/)
  Redis supports binary strings, but command definitions use string keys and string/number values, and `Command.args` is `string[]`. This is an existing representation limitation rather than a newly added Redis option. Supporting buffers requires coordinated signatures, serialization, reply handling, and transformation changes.

1.11. **Integer commands: support exact values across Redis's signed 64-bit range.**
  [INCRBY](src/commands/string/incrby.ts) · [DECRBY](src/commands/string/decrby.ts) · [HINCRBY](src/commands/hash/hincrby.ts) · [INCR](src/commands/string/incr.ts) · [DECR](src/commands/string/decr.ts) · [Redis reference](https://redis.io/docs/latest/commands/incrby/)
  JavaScript `number` cannot represent every signed 64-bit integer exactly. Increment/decrement arguments and result types currently rely on it. Choose an exact-value API for large integers and verify the underlying Redis client's reply decoding; changing TypeScript declarations alone is insufficient. Preserve compatibility for ordinary numeric calls deliberately.

## 2. Updates to already implemented commands

2.2. **ZINTERSTORE: add `AGGREGATE COUNT`, introduced in Redis 8.8.**
  [Implementation](src/commands/sorted-set/zinterstore.ts) · [Redis reference](https://redis.io/docs/latest/commands/zinterstore/)
  Extend `AGGREGATE` beyond `'SUM' | 'MIN' | 'MAX'`. The serializer already forwards the selected aggregate string, but the public type and documentation exclude `COUNT`. The result remains the number of members stored.

2.3. **XADD: add reference-handling policies introduced in Redis 8.2.**
  [Implementation](src/commands/stream/xadd.ts) · [Redis reference](https://redis.io/docs/latest/commands/xadd/)
  Expose `KEEPREF`, `DELREF`, and `ACKED` with the correct placement in the command arguments. Redis's default `KEEPREF` behavior already applies; selecting the other policies or explicitly supplying `KEEPREF` is not currently possible.

2.4. **XADD: add idempotent insertion introduced in Redis 8.6.**
  [Implementation](src/commands/stream/xadd.ts) · [Redis reference](https://redis.io/docs/latest/commands/xadd/)
  Add `IDMP producer-id idempotent-id` and `IDMPAUTO producer-id`. Model the mutually exclusive forms, serialize their arguments, and document that a duplicate returns the original entry ID. Preserve `NOMKSTREAM` nullability.

2.5. **XTRIM: add pending-reference policies.**
  [Implementation](src/commands/stream/xtrim.ts) · [Redis reference](https://redis.io/docs/latest/commands/xtrim/)
  Expose `KEEPREF`, `DELREF`, and `ACKED` alongside the existing strategy, operator, threshold, and `LIMIT` options. Preserve the default policy when none is supplied. The result remains the number of entries deleted.

2.6. **XREAD: add combined reply limits introduced in Redis 8.10.**
  [Implementation](src/commands/stream/xread.ts) · [Redis reference](https://redis.io/docs/latest/commands/xread/)
  Add `MAXCOUNT` and `MAXSIZE` to the option type and serializer. Document their cumulative scope across streams, as distinct from per-stream `COUNT`, and cover both single-stream and multi-stream overloads. Preserve the existing transformed result shapes.
