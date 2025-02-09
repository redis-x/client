// eslint-disable-next-line jsdoc/require-jsdoc
export function input(key, arg1, ...args_rest) {
    const args = [
        'ZREM',
        key,
    ];
    if (typeof arg1 === 'string') {
        args.push(arg1, ...args_rest);
    }
    else {
        args.push(...arg1);
    }
    return {
        kind: '#schema',
        args,
    };
}
