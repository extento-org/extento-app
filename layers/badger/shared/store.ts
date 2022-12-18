export type StoreKeys = 'badger.storage.tasks' 
    | 'badger.storage.browse_urls' 
    | 'badger.storage.alarm';

/* --------------------------------- HELPERS -------------------------------- */
function serialize(data: any): string {
    return JSON.stringify(data);
}

function deserialize(data: any): any {
    try {
        return JSON.parse(data);
    } catch (err) {
        return data;
    }
};

/* ----------------------------------- API ---------------------------------- */
export async function getList<ElementType>(key: StoreKeys): Promise<Array<ElementType>> {
    const val = await chrome.storage.local.get(key);
    if (typeof val[key] === 'string') {
        const found = deserialize(val[key]);
        if (!Array.isArray(found)) {
            return [];
        }
        return found;
    }
    return [];
}

export async function setList<ElementType>(key: StoreKeys, data: Array<ElementType>): Promise<void> {
    await chrome.storage.local.set({ [key]: serialize(data) });
}

export async function getNumber(key: StoreKeys): Promise<number> {
    const val = await chrome.storage.local.get(key);
    if (typeof val !== 'number') {
        // this is how we denote non-existence, yeah, weird
        return -Infinity;
    }
    return val;
}

export async function setNumber(key: StoreKeys, data: number): Promise<void> {
    await chrome.storage.local.set({ [key]: data });
}

export async function remove(key: StoreKeys): Promise<void> {
    await chrome.storage.local.remove(key);
}