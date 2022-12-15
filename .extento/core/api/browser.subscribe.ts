import constants from '@_core/constants';
import { Subscriber } from '@_core/common.types';

const subscribe: any = new Proxy({}, {
    get: (_, workspace) => (func: Function) => {
        window.addEventListener(
            constants.EXTENT_BACKGROUND_PUBLISHER,
            (_event: any) => {
                const request = _event?.detail?.request;
                if (request?.workspace === workspace) {
                    func(request?.data);
                }
            },
            false,
        );
    },
});

const defaultExport: Subscriber = subscribe;

export default defaultExport;
