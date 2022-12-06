import config_cacher from '@_package/shared/config_cacher';
import chrome_wrapper from '@_package/shared/chrome_wrapper';
import constants from '@_package/constants';

import '@_package/polyfill.js';

const entry = () => {
    // connects our browser/content script code to the background apis
    window.addEventListener(
        constants.EXTENT_BACKGROUND_API_INBOUND,
        (_event: CustomEvent) => {
            try {
                config_cacher.get_cb(
                    ({ config, message, err }) => {
                        if (err) {
                            throw new Error(message);
                        }
                        chrome_wrapper.post_window_message({
                            ..._event.detail,
                            config,
                            error: !!err,
                            error_message: message,
                        });
                    },
                );
            } catch(err) {
                // logging for dev purposes but we never expect to hit this
                console.error(err);
            }
        },
        false,
    );

    // used for one-way pub events fired from our background script
    chrome_wrapper.content_script_listen({
        [constants.EXTENT_BACKGROUND_PUBLISHER]: (request: any, send_response: (response?: any) => void) => {
            const event = new CustomEvent(constants.EXTENT_BACKGROUND_PUBLISHER, { detail: { request } });

            window.dispatchEvent(event);

            send_response();
        },
    });

    // create the dom script that loads in workspace functions
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL('EXT_DIST.built.onload.js');
    (document.head || document.documentElement).appendChild(script);

    // create the react script
    const react_ui_script = document.createElement('script');
    react_ui_script.setAttribute('defer', 'defer');
    react_ui_script.src = chrome.runtime.getURL('EXT_DIST.built.ui.js');
    document.head.appendChild(react_ui_script);

    // update the config cache immediately and then every 5 seconds
    config_cacher.update();
    setInterval(async () => {
        try {
            config_cacher.update();
        } catch(err) {
            console.error(err);
        }
    }, 10000);
};

entry();
