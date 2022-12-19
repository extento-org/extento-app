import chromeWrapper from '@_core/lib.chrome';
import constants from '@_core/constants';

const runWorkerProxy = () => {
    // connects our browser/content script code to the background apis
    window.addEventListener(
        constants.EXTENT_WORKER_INBOUND,
        (_event: CustomEvent) => {
            try {
                chromeWrapper.postWindowMessage(_event.detail);
            } catch (err) {
                // logging for dev purposes but we never expect to hit this
                console.error(err);
            }
        },
        false,
    );

    // used for one-way pub events fired from our background script
    chromeWrapper.contentScriptListen({
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
