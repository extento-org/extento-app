const fs_extra = require('fs-extra');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const validate = require('../validate');

const { 
    OPTIONAL_PATH_APP_TAB_PAGE,
    OPTIONAL_PATH_APP_POPUP_PAGE,
    OPTIONAL_PATH_APP_OPTIONS_PAGE,
    PATH_APP_CONFIG, 
    PATH_APP_WORKSPACES, 
    OUTPUT_PATH_APP_EXTENSION_MANIFEST, 
    DIST_ONLOAD, 
    DIST_BACKGROUND, 
    DIST_CONTENT_SCRIPT, 
    DIST_PAGES_HTML, 
    DIST_UI, 
    BASE_CHROME_PERMISSIONS, 
    SELECTIVE_BUILD_WORKSPACES, 
    ICONS, 
} = require('../constants.js');

const config = require(PATH_APP_CONFIG);

const workspace_allowed_in_build = (workspace) => {
    if (!Array.isArray(config.selective_builds[process.env.EXTENTO_SELECTIVE_BUILD])) {
        return true;
    }
    return config.selective_builds[process.env.EXTENTO_SELECTIVE_BUILD].includes(workspace);
};

const accum_workspace_manifest = (accessor_string, on_accum) => {
    const dir_paths = SELECTIVE_BUILD_WORKSPACES
        .filter(name => workspace_allowed_in_build(name))
        .map(name => path.resolve(PATH_APP_WORKSPACES, name));

    return dir_paths.reduce((accum, dir_path) => {
        let section;
        try {
            manifest = require(path.resolve(dir_path, 'manifest.json'));
            section = _.get(manifest, accessor_string, []);
        }
        catch (err) {
            throw new Error(`manifest.json not found in ${dir_path.replace(PATH_APP_WORKSPACES, '')}`);
        }
        return on_accum(accum, section);
    }, undefined);
};

const OPTIONS_URL = DIST_PAGES_HTML + '?options=true';
const POPUP_URL = DIST_PAGES_HTML + '?popup=true';
const TAB_URL = DIST_PAGES_HTML + '?tab=true';

const manifest_transform = (opts) => {
    const web_accessible_resources = [
        DIST_ONLOAD,
        DIST_UI,
        ...(opts.web_accessible_resources || [])
    ];

    const popup = fs.existsSync(OPTIONAL_PATH_APP_POPUP_PAGE) ? {
        default_title: opts.popup_name || 'Popup',
        default_popup: POPUP_URL
    } : undefined;

    const options = fs.existsSync(OPTIONAL_PATH_APP_OPTIONS_PAGE)
        ? OPTIONS_URL
        : undefined;
    
    const chrome_url_overrides = fs.existsSync(OPTIONAL_PATH_APP_TAB_PAGE) ? {
        newtab: TAB_URL
    } : undefined

    const required_permissions = (opts.required_permissions || [])
        .filter(required_permission => BASE_CHROME_PERMISSIONS.includes(required_permission))
        .concat(BASE_CHROME_PERMISSIONS);

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
        icons: ICONS.reduce((accum, { name, size }) => {
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
        chrome_url_overrides
    }));
};

const main = async () => {
    const matches = accum_workspace_manifest(
        'matches.value', 
        (accum = [], match_url_schemes = []) => _.union(accum, match_url_schemes)
    );
    const optional_permissions = accum_workspace_manifest(
        'permissions.value', 
        (accum = [], workspace_permissions = []) => _.union(accum, workspace_permissions)
    );

    validate.config(config);

    const opts = {
        ...config.manifest,
        matches,
        optional_permissions
    };

    fs_extra.outputFileSync(
        OUTPUT_PATH_APP_EXTENSION_MANIFEST, 
        JSON.stringify(manifest_transform(opts), null, 4)
    );
};

main();
