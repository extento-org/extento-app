const fs_extra = require('fs-extra');
const ajv = require('ajv');
const path = require('path');
const _ = require('lodash');

const validators = require('../validators');
const shared = require('../shared');

const {
    PROJECT_MANIFEST_PATH,
    WORKSPACES_PATH,
    CHROME_EXTENSION_MANIFEST_PATH,
    DIST_ONLOAD,
    DIST_BACKGROUND,
    DIST_CONTENT_SCRIPT,
    DIST_BROWSER_HTML,
    DIST_UI,
    INTERNALLY_REQUIRED_PERMISSIONS,
} = require('../constants.js');

const accum_workspace_manifest = (accessor_string, on_accum) => {
    const dir_paths = shared.get_workspace_dirs()
        .map(name => path.resolve(WORKSPACES_PATH, name));

    return dir_paths.reduce((accum, dir_path) => {
        let section;
        try {
            manifest = require(path.resolve(dir_path, 'manifest.json'));
            section = _.get(manifest, accessor_string, []);
        } catch (err) {
            throw new Error(`manifest.json not found in ${dir_path.replace(WORKSPACES_PATH, '')}`);
        }

        return on_accum(accum, section);
    }, undefined);
};

const OPTIONS_URL = DIST_BROWSER_HTML + '?options=true';
const POPUP_URL = DIST_BROWSER_HTML + '?popup=true';

const manifest_transform = (opts) => {
    const icons = shared.get_icons();

    const web_accessible_resources = [
        DIST_ONLOAD,
        DIST_UI,
        ...(opts.web_accessible_resources || [])
    ];

    const popup =  opts.use_popup ? {
        default_title: opts.popup_name || 'Popup',
        default_popup: POPUP_URL
    } : undefined;

    const options = opts.use_options
        ? OPTIONS_URL
        : undefined;

    const required_permissions = (opts.required_permissions || [])
        .filter(required_permission => INTERNALLY_REQUIRED_PERMISSIONS.includes(required_permission))
        .concat(INTERNALLY_REQUIRED_PERMISSIONS);

    return JSON.parse(JSON.stringify({
        version: opts.version,
        name: opts.name,
        optional_permissions: opts.optional_permissions,
        permissions: required_permissions,
        content_scripts: [{
            matches: opts.matches,
            js: [
                DIST_CONTENT_SCRIPT,
                ...(opts.content_scripts || [])
            ]
        }],
        manifest_version: 3,
        background: {
            service_worker: DIST_BACKGROUND,
            type: 'module' // optional
        },
        icons: icons.reduce((accum, { name, size }) => {
            accum[String(size)] = name;
            return accum;
        }, {}),
        host_permissions: opts.matches,
        action: popup,
        options_page: options,
        web_accessible_resources: [{
            resources: web_accessible_resources,
            matches: opts.matches
        }],
    }))
};

const build_manifest = async () => {
    const matches = accum_workspace_manifest(
        'matches.value', 
        (accum = [], match_url_schemes = []) => _.union(accum, match_url_schemes)
    );
    const optional_permissions = accum_workspace_manifest(
        'permissions.value', 
        (accum = [], workspace_permissions = []) => _.union(accum, workspace_permissions)
    );
    
    const manifest_options = require(PROJECT_MANIFEST_PATH);
    const validation_error = validators.app_manifest(manifest_options);
    if (validation_error) { 
        throw validation_error;
    }

    const opts = {
        ...manifest_options,
        matches,
        optional_permissions
    };
    
    fs_extra.outputFileSync(
        CHROME_EXTENSION_MANIFEST_PATH,
        JSON.stringify(manifest_transform(opts), null, 2)
    );
};

const main = async () => {
    await build_manifest();
};

main();