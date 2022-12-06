import chrome_wrapper from '@_core/lib.chrome';
import constants from '@_core/constants';
import worker_execute from '../worker.execute';

function listener<BackgroundApis>(background_apis: BackgroundApis) {
    chrome_wrapper.background_listen({
        // executes workspace function
        [constants.EXTENT_BACKGROUND_TYPE_ACTION]: (
            request: any, send_response: (response?: any) => void
        ) => {
            worker_execute(background_apis)(request, send_response);
        }
    });
};

export default listener;