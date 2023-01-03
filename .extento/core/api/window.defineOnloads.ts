import { LAYER_NAMES } from '@ex.compiled';

export default (onloads: Record<string, { default: any }>) => {
    window.onload = async () => {
        LAYER_NAMES.forEach((layer) => {
            const onload = onloads[layer]?.default;

            if (typeof onload === 'function') {
                onload();
            }
        });
    };
};
