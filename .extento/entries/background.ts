import { serializeError as serialize_error } from 'serialize-error';
import background_apis from '@_codegen/webpack.background_apis';
import { WorkspaceName } from '@extento.types';
import chrome_wrapper from '@_package/shared/chrome_wrapper';
import constants from '@_package/constants';

import '@_package/polyfill.js';

type BackgroundApis = typeof background_apis;

type UnknownArgsFunction = (...args: any[]) => any;

const handle_background_api = async (request: any, send_response: (response?: any) => void) => {
    if (request?.error) {
        send_response({
            error: serialize_error(
                new Error(request?.error_message),
            ),
        });
        return;
    }
    const args: any = request?.args;

    // cast request properties
    const workspace_name: WorkspaceName = request.workspace;
    const prop_name: keyof BackgroundApis[WorkspaceName] = request.prop;
    const inner_prop_name: string = request.inner_prop;

    // the function we'll execute
    let background_api_action: any = background_apis[workspace_name][prop_name];
    
    // some background api's are nested one level deeper
    if (typeof background_api_action[inner_prop_name] !== 'undefined') {
        background_api_action = background_api_action[inner_prop_name];
    }

    if (typeof background_api_action !== 'function') {
        const inner_prop_string = inner_prop_name ? `.${inner_prop_name}` : '';
        send_response({
            error: serialize_error(
                new Error(
                    `background_api: ${workspace_name}.${String(prop_name)}`
                    + `${inner_prop_string} is not a function`,
                ),
            ),
        });
        
        return;
    }

    try {
        const func: UnknownArgsFunction = background_api_action;
        const response = func(...args);

        // support sync and async background api functions
        if (response && (typeof response.then !== 'undefined')) {
            response
                .then((resolved_response: any) => send_response({ response: resolved_response }))
                .catch((error: Error) => send_response({ error: serialize_error(error) }));
        } else {
            send_response({ response });
        }
    } catch(error) {
        send_response({ error: serialize_error(error) });
    }
};

const entry = () => {
    chrome_wrapper.background_listen({
        // executes workspace function
        [constants.EXTENT_BACKGROUND_TYPE_ACTION]: (request: any, send_response: (response?: any) => void) => {
            handle_background_api(request, send_response);
        },
    });
};

entry();