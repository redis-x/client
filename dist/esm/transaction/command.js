import { isPlainObject } from '../utils.js';
export class RedisXTransactionCommand {
    index;
    _type; // Dummy private property
    // eslint-disable-next-line no-useless-constructor, no-empty-function
    constructor(index) {
        this.index = index;
    }
}
/**
 * Recursively walks through the object and unwraps all RedisTransactionCommand instances.
 * @param target Value to unwrap.
 * @param result Result of the transaction.
 * @returns The unwrapped value.
 */
export function unwrapRedisTransactionCommand(target, result) {
    if (target instanceof RedisXTransactionCommand) {
        return result[target.index];
    }
    if (Array.isArray(target)) {
        for (const [index, value] of target.entries()) {
            target[index] = unwrapRedisTransactionCommand(value, result);
        }
    }
    else if (isPlainObject(target)) {
        for (const [key, value] of Object.entries(target)) {
            // @ts-expect-error Somehow TS does not allow to write into the object
            target[key] = unwrapRedisTransactionCommand(value, result);
        }
    }
    return target;
}
