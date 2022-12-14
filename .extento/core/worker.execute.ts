import { serializeError as serialize_error } from 'serialize-error';
import { WorkspaceName } from '@extento.types';

type UnknownArgsFunction = (...args: any[]) => any;

const execute = (backgroundApis: any) => (
    request: any,
    send_response: (response?: any) => void,
) => {
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
    const workspaceName: WorkspaceName = request.workspace;
    const propName = request.prop;
    const innerPropName: string = request.inner_prop;

    // the function we'll execute
    let backgroundApiAction: any = backgroundApis[workspaceName][propName];

    // some background api's are nested one level deeper
    if (typeof backgroundApiAction[innerPropName] !== 'undefined') {
        backgroundApiAction = backgroundApiAction[innerPropName];
    }

    if (typeof backgroundApiAction !== 'function') {
        const innerPropString = innerPropName ? `.${innerPropName}` : '';
        send_response({
            error: serialize_error(
                new Error(
                    `backgroundApi: ${workspaceName}.${String(propName)}`
                    + `${innerPropString} is not a function`,
                ),
            ),
        });

        return;
    }

    try {
        const func: UnknownArgsFunction = backgroundApiAction;
        const response = func(...args);

        // support sync and async background api functions
        if (response && (typeof response.then !== 'undefined')) {
            response
                .then((resolved_response: any) => send_response({ response: resolved_response }))
                .catch((error: Error) => send_response({ error: serialize_error(error) }));
        } else {
            send_response({ response });
        }
    } catch (error) {
        send_response({ error: serialize_error(error) });
    }
};

export default execute;
