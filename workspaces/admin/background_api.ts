import config_cacher from '@extento/shared/config_cacher';

export const example = async () => {
    const config = await config_cacher.get();
    console.info('ran example function with config', config);
    
    return `api response`;
};