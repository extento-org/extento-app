import { v4 as uuid_v4 } from 'uuid';
import { deserializeError as deserialize_error } from 'serialize-error';
import chromeWrapper from '@_core/lib.chrome';

import { LayerName } from '@ex.compiled';
import constants from '@_core/constants';

const TIMEOUT_AT = 20000;

const handler = (
    layer: LayerName,
    prop: any,
    inner_prop?: string,
) => (...args: any[]) => new Promise((resolve, reject) => {
    const requestId = uuid_v4();

    // protect against race condition if the timeout happens too close to a received event
    let resolved = false;

    // handle the response from the content script
    // (which just proxies the response from the background api)
    const onMessageHandler = (event: MessageEvent) => {
        // only deal with events that we emitted
        if (event.data.requestId === requestId) {
            // prevent timeout error from occuring
            resolved = true;

            // serialized error originates from the background api
            if (event.data.error) {
                reject(deserialize_error(event.data.error));
            } else {
                resolve(event.data.response);
            }
        }
    };

    // listen for message events from the content script proxy
    window.addEventListener('message', onMessageHandler, false);

    // if it takes to long to get a response from the background api/content script proxy
    // we should reject with a descriptive error
    setTimeout(() => {
        // make sure we are no longer listening to messages
        window.removeEventListener('message', onMessageHandler);

        if (!resolved) {
            // provide a descriptive error that the application code can handle
            reject(new Error(
                `The follow backend_api function: ${layer}.${prop} timed out.`,
                {
                    cause: {
                        name: constants.EXTENT_WORKER_TIMEOUT,
                        message: `Timeout occurred after ${TIMEOUT_AT} milliseconds`,
                    },
                },
            ));
        }
    }, TIMEOUT_AT);

    // send the args off to our content script proxy, kicks off the correct background api method
    const event = new CustomEvent(constants.EXTENT_WORKER_INBOUND, {
        detail: {
            channel: constants.EXTENT_BACKGROUND_TYPE_ACTION,
            requestId,
            prop,
            inner_prop,
            layer,
            args,
        },
    });

    // attempt to bypass content script if we can
    try {
        chromeWrapper.postWindowMessage(event.detail);
    } catch (err) {
        window.dispatchEvent(event);
    }
});

function buildProxy<WorkerApis>(typed_workers: WorkerApis): WorkerApis {
    return new Proxy({}, {
        get: (...[, layer]: [any, LayerName]) => new Proxy({}, {
            get: (...[, prop]: [any, any]) => {
                const workers: any = typed_workers;
                if (!workers[layer][prop]) {
                    throw new Error(
                        `The follow backend_api function: ${layer}.${prop} does not exist`,
                    );
                }

                if (typeof workers[layer][prop] === 'function') {
                    return handler(layer, prop);
                }

                return new Proxy({}, {
                    get: (_: any, inner_prop: string) => {
                        const mod: any = workers[layer][prop];
                        if (!mod[inner_prop]) {
                            throw new Error(
                                `The follow backend_api function: ${layer}.${inner_prop} does not exist`,
                            );
                        }

                        return handler(layer, prop, inner_prop);
                    },
                });
            },
        }),
    });
}

export default buildProxy;
