// @ts-nocheck

import workers from '@_codegen/webpack.workers';
import instantiateCallWorker from '@_core/api/browser.instantiateCallWorker';

export default instantiateCallWorker<typeof workers>(workers);