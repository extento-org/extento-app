const path = require('path');
const fsExtra = require('fs-extra');
const _ = require('lodash');
const getBuildDetails = require('~/node/utils/getBuildDetails');
const validate = require('~/node/validate');

const constants = require('~/node/constants');

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

const getManifestPages = () => {
    const { pages = {} } = constants.USER_CONFIG
        .selective_builds[constants.SELECTIVE_BUILD] || {};

    const manifestPages = {};
    if (!!pages.Options) {
        manifestPages.options = pages.Options;
    }
    if (!!pages.Popup) {
        manifestPages.popup = pages.Popup;
    }
    if (!!pages.Tab) {
        manifestPages.tab = pages.Tab;
    }

    return manifestPages;
};

const optionsUrl = `${constants.DIST_PAGES_HTML}?options=true`;
const popupUrl = `${constants.DIST_PAGES_HTML}?popup=true`;
const tabUrl = `${constants.DIST_PAGES_HTML}?tab=true`;

const manifestTransform = (opts) => {
    const webAccessibleResources = [
        constants.DIST_ONLOAD,
        constants.DIST_UI,
    ];

    const manifestPages = getManifestPages();

    const popup = manifestPages.popup ? {
        default_popup: popupUrl,
    } : undefined;

    const options = manifestPages.options ? optionsUrl : undefined;

    const chromeUrlOverrides = manifestPages.tab ? {
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
};

module.exports = genManifest;
