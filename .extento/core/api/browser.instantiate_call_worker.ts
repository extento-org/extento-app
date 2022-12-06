import { v4 as uuid_v4 } from 'uuid';
import { deserializeError as deserialize_error } from 'serialize-error';

import { WorkspaceName } from '@extento.types';
import constants from '@_core/constants';

const TIMEOUT_AT = 20000;

function handler(
    workspace: WorkspaceName,
    prop: any,
    inner_prop?: string,
) {
    return (...args: any[]) => new Promise((resolve, reject) => {
        const request_id = uuid_v4();
    
        // protect against race condition if the timeout happens too close to a received event
        let resolved = false;
    
        // handle the response from the content script
        // (which just proxies the response from the background api)
        const on_message_handler = (event: MessageEvent) => {
            // only deal with events that we emitted
            if (event.data.request_id === request_id) {
                // prevent timeout error from occuring
                resolved = true;
    
                // serialized error originates from the background api
                if (event.data.error) {
                    return reject(deserialize_error(event.data.error));
                }
    
                resolve(event.data.response);
            }
        };
    
        // listen for message events from the content script proxy
        window.addEventListener('message', on_message_handler, false);
    
        // if it takes to long to get a response from the background api/content script proxy
        // we should reject with a descriptive error
        setTimeout(() => {
            // make sure we are no longer listening to messages
            window.removeEventListener('message', on_message_handler);
    
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
                request_id,
                prop,
                inner_prop,
                workspace,
                args,
            },
        });
    
        window.dispatchEvent(event);
    });
}

function build_proxy<BackgroundApis>(typed_background_apis: BackgroundApis): BackgroundApis {
    return new Proxy({}, {
        get: (...[, workspace]: [any, WorkspaceName]) => new Proxy({}, {
            get: (...[, prop]: [any, any]) => {
                const background_apis: any = typed_background_apis;
                if (!background_apis[workspace][prop]) {
                    throw new Error(
                        `The follow backend_api function: ${workspace}.${prop} does not exist`,
                    );
                }
    
                if (typeof background_apis[workspace][prop] === 'function') {
                    return handler(workspace, prop);
                }
    
                return new Proxy({}, {
                    get: (_: any, inner_prop: string) => {
                        const mod: any = background_apis[workspace][prop];
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
};

export default build_proxy;
