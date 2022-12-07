// @ts-nocheck

import background_apis from '@_codegen/webpack.background_apis';
import instantiate_call_worker from '@_core/api/browser.instantiate_call_worker';

export default instantiate_call_worker<typeof background_apis>(background_apis);
