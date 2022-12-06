import { workspace_names } from '@extento.types';
import { CodegenOnloads } from '@_core/common.types'

export default (onloads: CodegenOnloads) => {
    window.onload = async () => {
        workspace_names.forEach((workspace) => {
            const onload = onloads[workspace]?.default;
    
            if (typeof onload === 'function') {
                onload();
            }
        });
    };
};