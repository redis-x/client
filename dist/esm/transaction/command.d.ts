export declare class RedisXTransactionCommand<T> {
    index: number;
    private _type;
    constructor(index: number);
}
export type UnwrapRedisXTransactionCommand<T> = T extends RedisXTransactionCommand<infer A> ? A : T extends (infer U)[] ? UnwrapRedisXTransactionCommand<U>[] : T extends Record<string, any> ? {
    [K in keyof T]: UnwrapRedisXTransactionCommand<T[K]>;
} : T;
/**
 * Recursively walks through the object and unwraps all RedisTransactionCommand instances.
 * @param target Value to unwrap.
 * @param result Result of the transaction.
 * @returns The unwrapped value.
 */
export declare function unwrapRedisTransactionCommand<T>(target: T, result: unknown[]): UnwrapRedisXTransactionCommand<T>;
