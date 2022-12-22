const fs = require('fs');
const path = require('path');
const fsExtra = require('fs-extra');
const _ = require('lodash');
const getBuildDetails = require('../utils/getBuildDetails');
const validate = require('../validate');
const log = require('../utils/log');

const constants = require('../constants');

const accumLayerManifest = (accessorString, onAccum) => {
    const dirPaths = constants.SELECTIVE_BUILD_LAYERS
        .map((name) => path.resolve(constants.PATH_APP_LAYERS, name));

    return dirPaths.reduce((accum, dirPath) => {
        let section;
        let manifest;
        try {
            manifest = require(path.resolve(dirPath, 'manifest.json'));
            section = _.get(manifest, accessorString, []);
        } catch (err) {
            throw new Error(`manifest.json not found in ${dirPath.replace(constants.PATH_APP_LAYERS, '')}`);
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
        permissions: accumLayerManifest(
            'permissions.value',
            (accum = [], layerPermissions = []) => _.union(accum, layerPermissions),
        ),
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

    log.info(`validated user config structure`);

    const finalManifest = manifestTransform({
        ...constants.USER_CONFIG.manifest,
        matches: accumLayerManifest(
            'matches.value',
            (accum = [], matchUrlSchemes = []) => _.union(accum, matchUrlSchemes),
        ),
    });

    fsExtra.outputFileSync(
        constants.OUTPUT_PATH_APP_EXTENSION_MANIFEST,
        JSON.stringify(finalManifest, null, 4),
    );

    log.info(`created final manifest`);
};

module.exports = genManifest;
