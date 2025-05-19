// eslint-disable-next-line jsdoc/require-jsdoc
export function input(key, arg1, ...args_rest) {
    const args = [
        'ZREM',
        key,
    ];
    if (typeof arg1 === 'string' || typeof arg1 === 'number') {
        args.push(String(arg1), ...args_rest.map(String));
    }
    else {
        args.push(...[...arg1].map(String));
    }
    return {
        kind: '#schema',
        args,
    };
}
