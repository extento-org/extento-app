const fs = require('fs');
const path = require('path');
const fsExtra = require('fs-extra');
const _ = require('lodash');
const getBuildDetails = require('../utils/getBuildDetails');
const validate = require('../validate');
const { vLog } = require('../utils/logging');

const constants = require('../constants');

const accumWorkspaceManifest = (accessorString, onAccum) => {
    const dirPaths = constants.SELECTIVE_BUILD_WORKSPACES
        .map((name) => path.resolve(constants.PATH_APP_WORKSPACES, name));

    return dirPaths.reduce((accum, dirPath) => {
        let section;
        let manifest;
        try {
            manifest = require(path.resolve(dirPath, 'manifest.json'));
            section = _.get(manifest, accessorString, []);
        } catch (err) {
            throw new Error(`manifest.json not found in ${dirPath.replace(constants.PATH_APP_WORKSPACES, '')}`);
        }
        return onAccum(accum, section);
    }, undefined);
};

const optionsUrl = `${constants.DIST_PAGES_HTML}?options=true`;
const popupUrl = `${constants.DIST_PAGES_HTML}?popup=true`;
const tabUrl = `${constants.DIST_PAGES_HTML}?tab=true`;

const manifestTransform = (opts) => {
    const webAccessibleResources = [
        constants.DIST_ONLOAD,
        constants.DIST_UI,
    ];

    const popup = fs.existsSync(constants.OPTIONAL_PATH_APP_POPUP_PAGE) ? {
        default_popup: popupUrl,
    } : undefined;

    const options = fs.existsSync(constants.OPTIONAL_PATH_APP_OPTIONS_PAGE)
        ? optionsUrl
        : undefined;

    const chromeUrlOverrides = fs.existsSync(constants.OPTIONAL_PATH_APP_TAB_PAGE) ? {
        newtab: tabUrl,
    } : undefined;

    const buildDetails = getBuildDetails(constants.SELECTIVE_BUILD);

    return JSON.parse(JSON.stringify({
        version: buildDetails.version,
        name: buildDetails.name,
        optional_permissions: opts.optionalPermissions,
        permissions: constants.BASE_CHROME_PERMISSIONS,
        content_scripts: [{
            matches: opts.matches,
            js: [
                constants.DIST_CONTENT_SCRIPT,
                ...(opts.content_scripts || []),
            ],
        }],
        manifest_version: 3,
        background: {
            service_worker: constants.DIST_BACKGROUND,
            type: 'module',
        },
        icons: constants.ICONS.reduce((accum, icon) => {
            accum[String(icon.size)] = icon.name;
            return accum;
        }, {}),
        host_permissions: opts.matches,
        action: popup,
        options_page: options,
        web_accessible_resources: [{
            resources: webAccessibleResources,
            matches: opts.matches,
        }],
        chrome_url_overrides: chromeUrlOverrides,
    }));
};

const genManifest = () => {
    validate.config(constants.USER_CONFIG);

    vLog(`validated user config structure`);

    const finalManifest = manifestTransform({
        ...constants.USER_CONFIG.manifest,
        matches: accumWorkspaceManifest(
            'matches.value',
            (accum = [], matchUrlSchemes = []) => _.union(accum, matchUrlSchemes),
        ),
        optional_permissions: accumWorkspaceManifest(
            'permissions.value',
            (accum = [], workspacePermissions = []) => _.union(accum, workspacePermissions),
        ),
    });

    fsExtra.outputFileSync(
        constants.OUTPUT_PATH_APP_EXTENSION_MANIFEST,
        JSON.stringify(finalManifest, null, 4),
    );

    vLog(`created final manifest`);
};

module.exports = genManifest;
