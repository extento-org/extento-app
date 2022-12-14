import { WorkspaceName } from '@extento.types';

const getActiveTabs: () => Promise<chrome.tabs.Tab[]> = () => new Promise(
    (resolve, reject) => {
        try {
            chrome.tabs.query({}, resolve);
        } catch (err) {
            reject(err);
        }
    },
);

const publishToTab = (opts: {
    tab_id: number,
    data: any,
    workspace: WorkspaceName,
    channel: string,
}) => chrome.tabs.sendMessage(
    opts.tab_id,
    opts,
);

const postWindowMessage = (detail: any) => chrome.runtime.sendMessage(
    chrome.runtime.id,
    { href: window.location.href, ...detail },
    (data: Object) => window.postMessage({ ...detail, ...data }),
);

const sendMessage = (detail: any) => chrome.runtime.sendMessage(
    chrome.runtime.id,
    { href: window.location.href, ...detail },
);

const refreshAllTabs = async () => {
    const tabs = await getActiveTabs();
    tabs.forEach((tab) => chrome.tabs.reload(tab.id));
};

const backgroundListen = async (handlers: { [key: string]: Function }) => {
    chrome.runtime.onMessage.addListener((...[request,, send_response]) => {
        if (typeof handlers[request.channel] === 'function') {
            handlers[request.channel](request, send_response);
        } else {
            send_response();
        }

        return true;
    });
};

const contentScriptListen = async (handlers: { [key: string]: Function }) => {
    chrome.runtime.onMessage.addListener((...[request,, send_response]) => {
        if (typeof handlers[request.channel] === 'function') {
            handlers[request.channel](request, send_response);
        } else {
            send_response();
        }

        return true;
    });
};

const requestAddPermissions = (opts: {
    permissions: string[],
    origins: string[],
}) => new Promise((resolve) => {
    chrome.permissions.request(opts, (granted) => resolve(granted));
});

const requestRemovePermissions = (opts: {
    permissions: string[],
    origins: string[],
}) => new Promise((resolve) => {
    chrome.permissions.remove(opts, (granted) => resolve(granted));
});

const getAllPermissions = (): Promise<chrome.permissions.Permissions> => new Promise(
    (resolve) => {
        chrome.permissions.getAll(resolve);
    },
);

const getRuntimeId = () => new Promise((resolve) => {
    resolve(chrome.runtime.id);
});

const openOptions = () => new Promise((resolve) => {
    chrome.runtime.openOptionsPage(
        () => resolve(true),
    );
});

const storageSet = async (key: string, value: any): Promise<void> => {
    await new Promise((resolve) => {
        chrome.storage.local.remove(
            key,
            () => resolve(undefined),
        );
    });

    await new Promise((resolve) => {
        chrome.storage.local.set(
            { [key]: value },
            () => resolve(undefined),
        );
    });
};

const storageGet = (key: string): any => new Promise(
    (resolve) => {
        chrome.storage.local.get([key], (result: any) => resolve(result[key]));
    },
);

export default {
    getActiveTabs,
    refreshAllTabs,
    publishToTab,
    postWindowMessage,
    backgroundListen,
    contentScriptListen,
    sendMessage,
    getAllPermissions,
    requestAddPermissions,
    requestRemovePermissions,
    getRuntimeId,
    openOptions,
    storageSet,
    storageGet,
};
