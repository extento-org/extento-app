import use_config from '@extento.api/lib.use_config';

export const example = async () => {
    const config = await use_config.get();
    console.info('ran example function with config', config);
    
    return 'api response';
};
