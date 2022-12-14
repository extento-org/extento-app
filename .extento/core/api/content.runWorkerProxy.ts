import config from '@_core/api/lib.useConfig';
import chrome_wrapper from '@_core/lib.chrome';
import constants from '@_core/constants';

const runWorkerProxy = () => {
    // connects our browser/content script code to the background apis
    window.addEventListener(
        constants.EXTENT_BACKGROUND_API_INBOUND,
        (_event: CustomEvent) => {
            try {
                config.getCb(
                    ({ config: data, message, err }) => {
                        if (err) {
                            throw new Error(message);
                        }
                        chrome_wrapper.postWindowMessage({
                            ..._event.detail,
                            config: data,
                            error: !!err,
                            error_message: message,
                        });
                    },
                );
            } catch (err) {
                // logging for dev purposes but we never expect to hit this
                console.error(err);
            }
        },
        false,
    );

    // used for one-way pub events fired from our background script
    chrome_wrapper.contentScriptListen({
        [constants.EXTENT_BACKGROUND_PUBLISHER]: (
            request: any,
            send_response: (response?: any) => void,
        ) => {
            const event = new CustomEvent(
                constants.EXTENT_BACKGROUND_PUBLISHER,
                { detail: { request } },
            );

            window.dispatchEvent(event);

            send_response();
        },
    });
};

export default runWorkerProxy;
