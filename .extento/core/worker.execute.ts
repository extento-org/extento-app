import { serializeError as serialize_error } from 'serialize-error';
import { LayerName } from '@extento.types';

type UnknownArgsFunction = (...args: any[]) => any;

const execute = (workerApis: any) => (
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
    const layerName: LayerName = request.layer;
    const propName = request.prop;
    const innerPropName: string = request.inner_prop;

    // the function we'll execute
    let workerAction: any = workerApis[layerName][propName];

    // some background api's are nested one level deeper
    if (typeof workerAction[innerPropName] !== 'undefined') {
        workerAction = workerAction[innerPropName];
    }

    if (typeof workerAction !== 'function') {
        const innerPropString = innerPropName ? `.${innerPropName}` : '';
        send_response({
            error: serialize_error(
                new Error(
                    `worker: ${layerName}.${String(propName)}`
                    + `${innerPropString} is not a function`,
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
