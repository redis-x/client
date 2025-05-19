// eslint-disable-next-line jsdoc/require-jsdoc
export function input(key, value, options) {
    const args_options = [];
    if (options) {
        if (options.NX) {
            args_options.push('NX');
        }
        if (options.XX) {
            args_options.push('XX');
        }
        if (options.EX) {
            args_options.push('EX', String(options.EX));
        }
        if (options.PX) {
            args_options.push('PX', String(options.PX));
        }
        if (options.EXAT) {
            args_options.push('EXAT', String(options.EXAT));
        }
        if (options.PXAT) {
            args_options.push('PXAT', String(options.PXAT));
        }
        if (options.KEEPTTL) {
            args_options.push('KEEPTTL');
        }
        if (options.GET) {
            args_options.push('GET');
        }
    }
    return {
        kind: '#schema',
        args: [
            'SET',
            key,
            String(value),
            ...args_options,
        ],
    };
}
