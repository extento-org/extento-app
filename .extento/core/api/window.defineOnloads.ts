import { WORKSPACE_NAMES } from '@extento.types';
import { CodegenOnloads } from '@_core/common.types';

export default (onloads: CodegenOnloads) => {
    window.onload = async () => {
        WORKSPACE_NAMES.forEach((workspace) => {
            const onload = onloads[workspace]?.default;

            if (typeof onload === 'function') {
                onload();
            }
        });
    };
};
