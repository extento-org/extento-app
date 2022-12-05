import { WorkspaceConfigDefaultExport } from '@extento/lib/shared/config_cacher';

export type Config = {
    something: string;
    time: number;
};

// an arbitrary timeout is applied to demonstrate grabbing the config async
const config: WorkspaceConfigDefaultExport<Config> = () => new Promise(
    (resolve) => setTimeout(() => resolve({
        something: 'ok',
        time: Date.now(),
    }), 5000),
);

export default config;
