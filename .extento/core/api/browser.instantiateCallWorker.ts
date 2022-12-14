import { v4 as uuid_v4 } from 'uuid';
import { deserializeError as deserialize_error } from 'serialize-error';

import { WorkspaceName } from '@extento.types';
import constants from '@_core/constants';

const TIMEOUT_AT = 20000;

const handler = (
    workspace: WorkspaceName,
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
                `The follow backend_api function: ${workspace}.${prop} timed out.`,
                {
                    cause: {
                        name: constants.EXTENT_BACKGROUND_API_TIMEOUT,
                        message: `Timeout occurred after ${TIMEOUT_AT} milliseconds`,
                    },
                },
            ));
        }
    }, TIMEOUT_AT);

    // send the args off to our content script proxy, kicks off the correct background api method
    const event = new CustomEvent(constants.EXTENT_BACKGROUND_API_INBOUND, {
        detail: {
            channel: constants.EXTENT_BACKGROUND_TYPE_ACTION,
            requestId,
            prop,
            inner_prop,
            workspace,
            args,
        },
    });

    window.dispatchEvent(event);
});

function buildProxy<BackgroundApis>(typed_backgroundApis: BackgroundApis): BackgroundApis {
    return new Proxy({}, {
        get: (...[, workspace]: [any, WorkspaceName]) => new Proxy({}, {
            get: (...[, prop]: [any, any]) => {
                const backgroundApis: any = typed_backgroundApis;
                if (!backgroundApis[workspace][prop]) {
                    throw new Error(
                        `The follow backend_api function: ${workspace}.${prop} does not exist`,
                    );
                }

                if (typeof backgroundApis[workspace][prop] === 'function') {
                    return handler(workspace, prop);
                }

                return new Proxy({}, {
                    get: (_: any, inner_prop: string) => {
                        const mod: any = backgroundApis[workspace][prop];
                        if (!mod[inner_prop]) {
                            throw new Error(
                                `The follow backend_api function: ${workspace}.${inner_prop} does not exist`,
                            );
                        }

                        return handler(workspace, prop, inner_prop);
                    },
                });
            },
        }),
    });
}

export default buildProxy;
