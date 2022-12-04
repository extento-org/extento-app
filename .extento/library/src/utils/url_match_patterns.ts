import { startsWith } from 'lodash';

const ALL_SCHEMES = {};

const get_parts = (pattern: string) => {
    if (pattern === '<all_urls>') {
        return {
            scheme: ALL_SCHEMES,
            host: '*',
            path: '*',
        };
    }

    const match_scheme = '(\\*|http|https|file|ftp)';
    const match_host = '(\\*|(?:\\*\\.)?(?:[^/*]+))?';
    const match_path = '(.*)?';
    const regex = new RegExp(
        `^${
            match_scheme
        }://${
            match_host
        }(/)${
            match_path
        }$`,
    );

    const result = regex.exec(pattern);

    return {
        scheme: result[1],
        host: result[2],
        path: result[4],
    };
};

const create_matcher = (pattern: string) => {
    const parts = get_parts(pattern);
    let str = '^';

    // check scheme
    if (parts.scheme === ALL_SCHEMES) {
        str += '(http|https|ftp|file)';
    } else if (parts.scheme === '*') {
        str += '(http|https)';
    } else {
        str += parts.scheme;
    }

    str += '://';

    // check host
    if (parts.host === '*') {
        str += '.*';
    } else if (startsWith(parts.host, '*.')) {
        str += '.*';
        str += '\\.?';
        str += parts.host.substr(2).replace(/\./g, '\\.');
    } else if (parts.host) {
        str += parts.host;
    }

    // check path
    if (!parts.path) {
        str += '/?';
    } else if (parts.path) {
        str += '/';
        str += parts.path
            .replace(/[?.+^${}()|[\]\\]/g, '\\$&')
            .replace(/\*/g, '.*');
    }

    str += '$';

    const regex = new RegExp(str);
    return function match_url(url: string) {
        return regex.test(url);
    };
};

const url_match_patterns = function (pattern: string, optional_url: string) {
    const matcher = create_matcher(pattern);

    if (arguments.length === 2) {
        return matcher(optional_url);
    }

    return matcher;
};

export default url_match_patterns;
