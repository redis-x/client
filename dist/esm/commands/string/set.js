/* eslint-disable no-redeclare */
/* eslint-disable no-unused-vars */
/* eslint-disable no-dupe-class-members */
/* eslint-disable jsdoc/require-jsdoc */
export function input(key, value, options) {
    const command_arguments = [
        'SET',
        key,
        value,
    ];
    let modifier;
    if (options) {
        if (options.NX) {
            command_arguments.push('NX');
        }
        else if (options.XX) {
            command_arguments.push('XX');
        }
        if (options.EX) {
            command_arguments.push('EX', String(options.EX));
        }
        else if (options.PX) {
            command_arguments.push('PX', String(options.PX));
        }
        else if (options.EXAT) {
            command_arguments.push('EXAT', String(options.EXAT));
        }
        else if (options.PXAT) {
            command_arguments.push('PXAT', String(options.PXAT));
        }
        else if (options.KEEPTTL) {
            command_arguments.push('KEEPTTL');
        }
        if (options.GET) {
            command_arguments.push('GET');
            modifier = 'GET';
        }
    }
    return [
        command_arguments,
        modifier,
    ];
}