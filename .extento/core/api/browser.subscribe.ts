import constants from '@ex.compiled/constants';
import { Subscriber } from '@_core/common.types';

const subscribe: any = new Proxy({}, {
    get: (_, layer) => (func: Function) => {
        window.addEventListener(
            constants.CHANNEL_PUBLISH,
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
