import { serializeError as serialize_error } from 'serialize-error';
import { WORKSPACE_NAMES, WorkspaceName } from '@extento.types';
import constants from '@_core/constants';
import chrome_wrapper from '@_core/lib.chrome';

// Types
export type CachedConfig = Partial<{ [key in WorkspaceName]: any }>;
export type Storage = { updated_at?: number, config: CachedConfig };
export type WorkspaceConfigDefaultExport<Resolved> =
    (() => Promise<Resolved>)
    | Resolved
    | (() => Resolved);

// Helper Functions
const storageSet = (storage: any): Promise<void> => chrome_wrapper
    .storageSet(constants.EXTENT_CONFIG_STORE, storage);

const storageGet = async (): Promise<Storage> => {
    const storage: Storage | null = await chrome_wrapper.storageGet(constants.EXTENT_CONFIG_STORE);

    return storage;
};

// API
const update = async (configs?: { [key in WorkspaceName]: any }): Promise<Storage> => {
    const funcs = WORKSPACE_NAMES.map((workspace_name) => async (): Promise<{
        [x in string]: {
            config: any,
            err: any,
        }
    }> => {
        try {
            const workspaceConfig = (configs || {})[workspace_name];

            // allow sync/async funcs and plain objects
            let resolved: any = workspaceConfig;

            if (typeof resolved === 'function') {
                resolved = resolved();
            }

            if (typeof resolved === 'object' && typeof resolved.then !== 'undefined') {
                resolved = await resolved;
            }

            return {
                [workspace_name]: {
                    config: resolved,
                    err: null,
                },
            };
        } catch (err) {
            console.error(err);

            return {
                [workspace_name]: {
                    config: null,
                    err: serialize_error(err),
                },
            };
        }
    });

    const slices = await Promise.all(funcs.map((func: Function) => func()));

    const data = {
        config: Object.assign(
            {},
            ...slices,
        ),
        updated_at: Date.now(),
    };

    await storageSet(data);

    return data;
};

// will attempt to get the stored config every 'maxRetries * 2' seconds
// ensures that if there's some latency grabbing config data we don't bug out
const getCb = async (cb: (opts: {
    config: CachedConfig,
    err: null | object,
    message: string,
}) => void, retry_attempts: number = 0): Promise<any> => {
    const maxRetries = 7;
    const nextRetryAttempts = retry_attempts + 1;
    const storage = await storageGet();

    if (!storage) {
        if (retry_attempts > maxRetries) {
            return cb({
                config: null,
                err: null,
                message: '',
            });
        }

        return setTimeout(() => getCb(cb, nextRetryAttempts), 2000);
    }

    try {
        const tenSeconds = 10000;

        if (tenSeconds < Date.now() - storage.updated_at) {
            if (retry_attempts > maxRetries) {
                return cb({
                    config: null,
                    err: new Error(constants.MSG_STALE_CONFIG_DATA_FOUND),
                    message: constants.MSG_STALE_CONFIG_DATA_FOUND,
                });
            }

            return setTimeout(() => getCb(cb, nextRetryAttempts), 3000);
        }

        return cb({
            config: storage.config,
            err: null,
            message: '',
        });
    } catch (err) {
        if (retry_attempts > maxRetries) {
            return cb({
                config: null,
                err,
                message: constants.MSG_NO_CONFIG_DATA_FOUND,
            });
        }

        return setTimeout(() => getCb(cb, nextRetryAttempts), 2000);
    }
};

const get = async (): Promise<CachedConfig> => new Promise(
    (resolve) => {
        getCb(({ config }) => resolve(config));
    },
);

export default {
    update,
    getCb,
    get,
};
