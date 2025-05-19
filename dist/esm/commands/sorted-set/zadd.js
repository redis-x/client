// eslint-disable-next-line jsdoc/require-jsdoc
export function input(key, arg1, arg2, arg3) {
    const args = [
        'ZADD',
        key,
    ];
    const pairs = [];
    if (typeof arg1 === 'number') {
        pairs.push(String(arg1), arg2);
    }
    else {
        for (const [member, score] of Object.entries(arg1)) {
            pairs.push(String(score), member);
        }
    }
    const options = (typeof arg2 === 'string' || typeof arg2 === 'number') ? arg3 : arg2;
    if (options) {
        if (options.NX) {
            args.push('NX');
        }
        if (options.XX) {
            args.push('XX');
        }
        if (options.GT) {
            args.push('GT');
        }
        if (options.LT) {
            args.push('LT');
        }
        if (options.CH) {
            args.push('CH');
        }
        if (options.INCR) {
            args.push('INCR');
        }
    }
    args.push(...pairs);
    return {
        kind: '#schema',
        args,
        replyTransform(result) {
            if (typeof result === 'string') {
                return Number.parseFloat(result);
            }
            return result;
        },
    };
}
