import onloads from '@_codegen/webpack.onloads';
import { workspace_names } from '@extento.types';

const entry = () => {
    window.onload = async () => {
        workspace_names.forEach((workspace) => {
            const onload = onloads[workspace]?.default;
    
            if (typeof onload === 'function') {
                onload();
            }
        });
    };
};

entry();