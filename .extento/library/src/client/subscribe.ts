import { WorkspaceName } from '@codegen/webpack.types';
import constants from '@extento/constants';

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
