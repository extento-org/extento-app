import { WorkspaceName } from '@extento.types';

const get_active_tabs: () => Promise<chrome.tabs.Tab[]> = (): Promise<chrome.tabs.Tab[]> => new Promise(
    (resolve, reject) => {
        try {
            chrome.tabs.query({}, resolve);
        } catch(err) {
            reject(err);
        }
    },
);

const publish_to_tab = (opts: {
    tab_id: number,
    data: any,
    workspace: WorkspaceName,
    channel: string,
}) => chrome.tabs.sendMessage(
    opts.tab_id,
    opts,
);

const post_window_message = (detail: any) => chrome.runtime.sendMessage(
    chrome.runtime.id,
    { href: window.location.href, ...detail },
    (data: Object) => window.postMessage({ ...detail, ...data }),
);

const send_message = (detail: any) => chrome.runtime.sendMessage(
    chrome.runtime.id,
    { href: window.location.href, ...detail },
);

const refresh_all_tabs = async () => {
    const tabs = await get_active_tabs();
    tabs.forEach((tab) => chrome.tabs.reload(tab.id));
};

const background_listen = async (handlers: { [key: string]: Function }) => {
    chrome.runtime.onMessage.addListener((...[request,, send_response]) => {
        if (typeof handlers[request.channel] === 'function') {
            handlers[request.channel](request, send_response);
        } else {
            send_response();
        }

        return true;
    });
};

const content_script_listen = async (handlers: { [key: string]: Function }) => {
    chrome.runtime.onMessage.addListener((...[request,, send_response]) => {
        if (typeof handlers[request.channel] === 'function') {
            handlers[request.channel](request, send_response);
        } else {
            send_response();
        }

        return true;
    });
};

const request_add_permissions = async (opts: {
    permissions: string[],
    origins: string[],
}) => new Promise((resolve) => chrome.permissions.request(opts, (granted) => resolve(granted)));

const request_remove_permissions = async (opts: {
    permissions: string[],
    origins: string[],
}) => new Promise((resolve) => chrome.permissions.remove(opts, (granted) => resolve(granted)));

const get_all_permissions = (): Promise<chrome.permissions.Permissions> => new Promise(
    (resolve) => chrome.permissions.getAll(resolve),
);

const get_runtime_id = () => new Promise((resolve) => resolve(chrome.runtime.id));

const open_options = () => new Promise((resolve) => chrome.runtime.openOptionsPage(
    () => resolve(true),
));

const storage_set = async (key: string, value: any): Promise<void> => {
    await new Promise((resolve) => chrome.storage.local.remove(
        key,
        () => resolve(undefined),
    ));

    await new Promise((resolve) => chrome.storage.local.set(
        { [key]: value },
        () => resolve(undefined),
    ));
};

const storage_get = (key: string): any => new Promise(
    (resolve) => chrome.storage.local.get([key], (result: any) => resolve(result[key])),
);

export default {
    get_active_tabs,
    refresh_all_tabs,
    publish_to_tab,
    post_window_message,
    background_listen,
    content_script_listen,
    send_message,
    get_all_permissions,
    request_add_permissions,
    request_remove_permissions,
    get_runtime_id,
    open_options,
    storage_set,
    storage_get,
};