// @ts-nocheck

import backgroundApis from '@_codegen/webpack.backgroundApis';
import instantiateCallWorker from '@_core/api/browser.instantiateCallWorker';

export default instantiateCallWorker<typeof backgroundApis>(backgroundApis);