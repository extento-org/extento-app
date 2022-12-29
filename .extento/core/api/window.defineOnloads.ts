import { LAYER_NAMES } from '@ex.compiled';
import { CodegenOnloads } from '@_core/common.types';

export default (onloads: CodegenOnloads) => {
    window.onload = async () => {
        LAYER_NAMES.forEach((layer) => {
            const onload = onloads[layer]?.default;

            if (typeof onload === 'function') {
                onload();
            }
        });
    };
};
