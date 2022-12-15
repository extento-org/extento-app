import constants from '@_core/constants';
import { Subscriber } from '@_core/common.types';

const subscribe: any = new Proxy({}, {
    get: (_, layer) => (func: Function) => {
        window.addEventListener(
            constants.EXTENT_BACKGROUND_PUBLISHER,
            (_event: any) => {
                const request = _event?.detail?.request;
                if (request?.layer === layer) {
                    func(request?.data);
                }
            },
            false,
        );
    },
});

const defaultExport: Subscriber = subscribe;

export default defaultExport;
