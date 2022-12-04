import onloads from '@codegen/webpack.onloads';
import { workspace_names } from '@codegen/webpack.types';

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

export default entry;
