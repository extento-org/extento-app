import chromeWrapper from '@_core/lib.chrome';
import constants from '@_core/constants';
import workerExecute from '../worker.execute';

function listener<BackgroundApis>(backgroundApis: BackgroundApis) {
    chromeWrapper.backgroundListen({
        // executes workspace function
        [constants.EXTENT_BACKGROUND_TYPE_ACTION]: (
            request: any,
            send_response: (response?: any) => void,
        ) => {
            workerExecute(backgroundApis)(request, send_response);
        },
    });
}

export default listener;
