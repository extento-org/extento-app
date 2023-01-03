import constants from '@ex.compiled/constants';

export const sendMessageToWorker = (_event: CustomEvent) => {
    if (typeof chrome?.runtime?.id === 'undefined') {
        throw new Error('chrome.runtime.id must be defined');
    }
    return chrome.runtime.sendMessage(
        // ensure we send it to the correct service worker
        chrome.runtime.id,
        // format the payload
        { href: window.location.href, ..._event.detail },
        // upon success, post a message
        (data: Object) => window.postMessage({ detail: _event.detail, data }),
    );
};

const runWorkerProxy = () => {
    // connects our browser/content script code to the background apis
    window.addEventListener(
        constants.CHANNEL_WORKER_PROXY,
        (_event: CustomEvent) => {
            try {
                sendMessageToWorker(_event);
            } catch (err) {
                // logging for dev purposes but we never expect to hit this
                console.error(err);
            }
        },
        false,
    );
};

export default runWorkerProxy;
