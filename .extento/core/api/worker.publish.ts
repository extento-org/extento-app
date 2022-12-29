import { LayerName } from '@ex.compiled';
import chromeWrapper from '@_core/lib.chrome';
import constants from '@_core/constants';
import { Publisher } from '@_core/common.types';

const publish: any = new Proxy({}, {
    get: (_, layer: LayerName) => async (message: any) => {
        chromeWrapper.postWindowMessage({
            data: {
                channel: constants.EXTENT_BACKGROUND_PUBLISHER,
                layer,
                message,
            },
        });
    },
});

const defaultExport: Publisher = publish;

export default defaultExport;
