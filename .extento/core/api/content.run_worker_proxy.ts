import config from '@_core/api/lib.use_config';
import chrome_wrapper from '@_core/lib.chrome';
import constants from '@_core/constants';

export default () => {
    // connects our browser/content script code to the background apis
    window.addEventListener(
        constants.EXTENT_BACKGROUND_API_INBOUND,
        (_event: CustomEvent) => {
            try {
                config.get_cb(
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
};