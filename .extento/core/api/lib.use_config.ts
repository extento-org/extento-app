import { serializeError as serialize_error } from 'serialize-error';
import { workspace_names, WorkspaceName } from '@extento.types';
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
const storage_set = (storage: any): Promise<void> => chrome_wrapper
    .storage_set(constants.EXTENT_CONFIG_STORE, storage);

const storage_get = async (): Promise<Storage> => {
    const storage: Storage|null = await chrome_wrapper.storage_get(constants.EXTENT_CONFIG_STORE);

    return storage;
};

// API
const update = async (configs?: { [key in WorkspaceName]: any }): Promise<Storage> => {
    const funcs = workspace_names.map((workspace_name: WorkspaceName) => async () => {
        try {
            const workspace_config = (configs || {})[workspace_name];

            // allow sync/async funcs and plain objects
            let resolved: any = workspace_config;

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
        } catch(err) {
            console.error(err);

            return {
                [workspace_name]: {
                    config: null,
                    err: serialize_error(err),
                },
            };
        }
    });

    const slices = await Promise.all(funcs.map((func) => func()));

    const data = {
        config: Object.assign(
            {},
            ...slices,
        ),
        updated_at: Date.now(),
    };

    await storage_set(data);

    return data;
};

// will attempt to get the stored config every 'max_retries * 2' seconds
// ensures that if there's some latency grabbing config data we don't bug out
const get_cb = async (cb: (opts: {
    config: CachedConfig,
    err: null | object,
    message: string,
}) => void, retry_attempts: number = 0): Promise<any> => {
    const max_retries = 7;
    const next_retry_attempts = retry_attempts + 1;
    const storage = await storage_get();

    if (!storage) {
        if (retry_attempts > max_retries) {
            return cb({
                config: null,
                err: null,
                message: '',
            });
        }

        return setTimeout(() => get_cb(cb, next_retry_attempts), 2000);
    }

    try {
        const ten_seconds = 10000;

        if (ten_seconds < Date.now() - storage.updated_at) {
            if (retry_attempts > max_retries) {
                return cb({
                    config: null,
                    err: new Error(constants.MSG_STALE_CONFIG_DATA_FOUND),
                    message: constants.MSG_STALE_CONFIG_DATA_FOUND,
                });
            }

            setTimeout(() => get_cb(cb, next_retry_attempts), 3000);
            return;
        }

        return cb({
            config: storage.config,
            err: null,
            message: '',
        });
    } catch(err) {
        if (retry_attempts > max_retries) {
            return cb({
                config: null,
                err,
                message: constants.MSG_NO_CONFIG_DATA_FOUND,
            });
        }

        return setTimeout(() => get_cb(cb, next_retry_attempts), 2000);
    }
};

const get = async (): Promise<CachedConfig> => new Promise(
    (resolve) => get_cb(({ config }) => resolve(config)),
);

export default {
    update,
    get_cb,
    get,
};;