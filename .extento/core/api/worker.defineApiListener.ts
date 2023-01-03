import constants from '@ex.compiled/constants';
import { serializeError } from 'serialize-error';
import { LayerName } from '@ex.compiled';

type UnknownArgsFunction = (...args: any[]) => any;

const workerExecute = (workerApis: any) => (
    request: any,
    sendResponse: (response?: any) => void,
) => {
    const args: any = request?.args;

    // cast request properties
    const layerName: LayerName = request.layer;
    const propName = request.prop;

    // the function we'll execute
    const workerAction: any = workerApis[layerName][propName];

    if (typeof workerAction !== 'function') {
        sendResponse({
            error: serializeError(
                new Error(
                    `worker: ${layerName}.${String(propName)} is not a function`,
                ),
            ),
        });

        return;
    }

    try {
        const func: UnknownArgsFunction = workerAction;
        const response = func(...args);

        // support sync and async background api functions
        if (response && (typeof response.then !== 'undefined')) {
            response
                .then((res: any) => sendResponse({ response: res }))
                .catch((error: Error) => sendResponse({ error: serializeError(error) }));
        } else {
            sendResponse({ response });
        }
    } catch (error) {
        sendResponse({ error: serializeError(error) });
    }
};

function defineApiListener(workerApis: any) {
    chrome.runtime.onMessage.addListener((...[request,,sendResponse]) => {
        if (request.channel === constants.CHANNEL_WORKER_INBOUND) {
            workerExecute(workerApis)(request, sendResponse);
        }

        return true;
    });
}

export default defineApiListener;
