import chromeWrapper from '@_core/lib.chrome';
import constants from '@_core/constants';
import workerExecute from '../worker.execute';

function defineListener(workerApis: any) {
    chromeWrapper.backgroundListen({
        // executes layer function
        [constants.EXTENT_BACKGROUND_TYPE_ACTION]: (
            request: any,
            send_response: (response?: any) => void,
        ) => {
            workerExecute(workerApis)(request, send_response);
        },
    });
}

export default defineListener;
