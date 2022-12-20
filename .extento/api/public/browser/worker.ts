// @ts-nocheck

import workerApis from '@_codegen/webpack.workerApis';
import instantiateCallWorker from '@_core/api/browser.instantiateCallWorker';

export default instantiateCallWorker<typeof workerApis>(workerApis);