// eslint-disable-next-line jsdoc/require-jsdoc
export function input(key, arg1, arg2) {
    const pairs = [];
    if (typeof arg1 === 'string') {
        pairs.push(arg1, String(arg2));
    }
    else {
        for (const [field, value] of Object.entries(arg1)) {
            pairs.push(field, String(value));
        }
    }
    return {
        kind: '#schema',
        args: [
            'HSET',
            key,
            ...pairs,
        ],
    };
}
