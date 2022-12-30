import { LayerName } from '@ex.compiled';
import chromeWrapper from '@_core/lib.chrome';
import constants from '@ex.compiled/constants';
import { Publisher } from '@_core/common.types';

const publish: any = new Proxy({}, {
    get: (_, layer: LayerName) => async (message: any) => {
        chromeWrapper.postWindowMessage({
            data: {
                channel: constants.CHANNEL_PUBLISH,
                layer,
                message,
            },
        });
    },
});

const defaultExport: Publisher = publish;

export default defaultExport;
