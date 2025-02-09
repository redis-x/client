// eslint-disable-next-line jsdoc/require-jsdoc
export function input(key, start, stop, options) {
    const args = [
        'ZRANGE',
        key,
        String(start),
        String(stop),
    ];
    if (options) {
        if (options.BY) {
            args.push(`BY${options.BY}`);
        }
        if (options.REV) {
            args.push('REV');
        }
        if (options.LIMIT) {
            args.push('LIMIT', String(options.LIMIT[0]), String(options.LIMIT[1]));
        }
        if (options.WITHSCORES) {
            args.push('WITHSCORES');
        }
    }
    return {
        kind: '#schema',
        args,
        replyTransform(result) {
            if (options?.WITHSCORES) {
                const transformed_result = [];
                for (let index = 0; index < result.length; index += 2) {
                    transformed_result.push({
                        member: result[index],
                        score: Number(result[index + 1]),
                    });
                }
                return transformed_result;
            }
            return result;
        },
    };
}
