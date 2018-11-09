
import errorConfig from './errorConfig';

export let extend = function (...args) {
    var res = args[0] || {};
    for (let i = 1; i < args.length; i++) {
        var arg = args[i];
        if (typeof (arg) !== 'object') {
            continue;
        }
        for (var key in arg) {
            if (arg[key] !== undefined)
                res[key] = arg[key];
        }
    }
    return res;
};

export let stringFormat = function (formatString: string, ...args) {
    if (!formatString)
        formatString = '';
    let reg = /(\{(\d)\})/g;
    if (typeof args[0] === 'object') {
        args = args[0];
        reg = /(\{([^{}]+)\})/g;
    }
    let result = formatString.replace(reg, function () {
        let match = arguments[2];
        return args[match] || '';
    });
    return result;
};
export let clone = function <T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
};


/**
 * enumerable装饰器
 */
export function enumerable(value: boolean): PropertyDecorator;
export function enumerable(value: boolean): MethodDecorator;
export function enumerable(value: boolean) {
    return function (target: any, propertyKey: string, descriptor?: PropertyDescriptor) {
        if (descriptor) {
            descriptor.enumerable = value;
            //return descriptor;
        } else {
            descriptor = Object.getOwnPropertyDescriptor(target, propertyKey) || {};
            if (descriptor.enumerable != value) {
                descriptor.enumerable = value;
                Object.defineProperty(target, propertyKey, descriptor)
            }
        }
    };
}

//code: string || errorConfig
export let error = function (msg, code?) {
    if (!code)
        code = '';
    let error;
    if (typeof code !== 'string') {
        error = code;
        code = error.code;
    }
    else {
        error = getErrorConfigByCode(code);
    }
    if (!msg) msg = '';
    if (typeof msg == 'object') msg = JSON.stringify(msg);
    var err: any = new Error(msg);
    err.code = code;
    return err;
};

export let getErrorConfigByCode = function (code) {
    if (!code)
        return undefined;
    for (let key in errorConfig) {
        if (errorConfig[key].code == code)
            return errorConfig[key];
    }
};
