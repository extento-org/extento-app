// @ts-nocheck

import workerApis from '@_compiled/bridge/workerApis';
import workerApiProxy from '@_core/api/browser.workerApiProxy';

export default workerApiProxy<typeof workerApis>(workerApis);