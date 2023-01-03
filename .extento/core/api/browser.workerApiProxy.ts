import { v4 as uuidv4 } from 'uuid';
import { deserializeError } from 'serialize-error';

import { LayerName } from '@ex.compiled';
import constants from '@ex.compiled/constants';
import { sendMessageToWorker } from '@_core/api/content.runWorkerProxy';

const TWENTY_SECONDS = 20000;

const handler = (
    layer: LayerName,
    prop: any,
) => (...args: any[]) => new Promise((resolve, reject) => {
    const requestId = uuidv4();

    // protect against race condition if the timeout happens too close to a received event
    let resolved = false;

    // handle the response from the content script
    // (which just proxies the response from the background api)
    const onMessageHandler = (event: MessageEvent) => {
        // only deal with events that we emitted
        if (event?.data?.detail?.requestId === requestId) {
            // prevent timeout error from occuring
            resolved = true;

            // serialized error originates from the background api
            if (event?.data?.worker?.error) {
                reject(deserializeError(event.data.worker.error));
            } else {
                resolve(event?.data?.worker?.response);
            }
        }
    };

    // listen for message events from the content script proxy
    window.addEventListener('message', onMessageHandler);

    console.info(`registered ${onMessageHandler.toString()}`);

    // if it takes to long to get a response from the background api/content script proxy
    // we should reject with a descriptive error
    setTimeout(() => {
        // make sure we are no longer listening to messages
        window.removeEventListener('message', onMessageHandler);

        if (!resolved) {
            // provide a descriptive error that the application code can handle
            reject(new Error(
                `The follow workerApi function: ${layer}.${prop} timed out.`,
            ));
        }
    }, TWENTY_SECONDS);

    // send the args off to our content script proxy, kicks off the correct background api method
    const event = new CustomEvent(constants.CHANNEL_WORKER_PROXY, {
        detail: {
            channel: constants.CHANNEL_WORKER_INBOUND,
            requestId,
            prop,
            layer,
            args,
        },
    });

    // attempt to bypass content script if we can
    try {
        sendMessageToWorker(event);
    } catch (err) {
        window.dispatchEvent(event);
    }
});

function workerApiProxy<WorkerApis>(workerApis: any): WorkerApis {
    return new Proxy({}, {
        get: (...[, layer]: [any, LayerName]) => new Proxy({}, {
            get: (...[, prop]: [any, any]) => {
                if (typeof workerApis[layer][prop] !== 'function') {
                    throw new Error(
                        `The follow backend_api function: ${layer}.${prop} does not exist`,
                    );
                }

                return handler(layer, prop);
            },
        }),
    });
}

export default workerApiProxy;
