import chromeWrapper from '@_core/lib.chrome';
import constants from '@_core/constants';
import workerExecute from '../worker.execute';

function listener<BackgroundApis>(workers: BackgroundApis) {
    chromeWrapper.backgroundListen({
        // executes layer function
        [constants.EXTENT_BACKGROUND_TYPE_ACTION]: (
            request: any,
            send_response: (response?: any) => void,
        ) => {
            workerExecute(workers)(request, send_response);
        },
    });
}

export default listener;
