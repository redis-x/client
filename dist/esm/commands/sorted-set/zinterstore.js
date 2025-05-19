// eslint-disable-next-line jsdoc/require-jsdoc
export function input(destination, arg1, options) {
    const args = [
        'ZINTERSTORE',
        destination,
    ];
    if (Array.isArray(arg1)) {
        args.push(String(arg1.length), ...arg1.map(String));
    }
    else {
        const entries = Object.entries(arg1);
        args.push(String(entries.length));
        const weights = [];
        for (const [key, weight] of entries) {
            args.push(key);
            weights.push(String(weight));
        }
        args.push('WEIGHTS', ...weights);
    }
    if (options?.AGGREGATE) {
        args.push('AGGREGATE', options.AGGREGATE);
    }
    return {
        kind: '#schema',
        args,
    };
}
