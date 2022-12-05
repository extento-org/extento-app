import { WorkspaceName } from '@extento/types';
import constants from '@exento/lib/constants';

type Subscriber = { [key in WorkspaceName]: Function };

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

const _: Subscriber = subscribe;

export default _;
