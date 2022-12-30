import chromeWrapper from '@_core/lib.chrome';
import constants from '@ex.compiled/constants';
import workerExecute from '../worker.execute';

function defineListener(workerApis: any) {
    chromeWrapper.backgroundListen({
        // executes layer function
        [constants.CHANNEL_WORKER_INBOUND]: (
            request: any,
            send_response: (response?: any) => void,
        ) => {
            workerExecute(workerApis)(request, send_response);
        },
    });
}

export default defineListener;
