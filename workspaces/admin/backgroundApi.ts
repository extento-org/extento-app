import useConfig from '@extento.api/lib.useConfig';

export const example = async () => {
    const config = await useConfig.get();
    console.info('ran example function with config', config);
    
    return 'api response';
};
