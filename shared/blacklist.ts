import * as store from './store';

/* ----------------------------------- API ---------------------------------- */
export async function get(): Promise<Array<string>> {
    const urls = await store.getList<string>('badger.storage.browse_urls');
    return urls;
};

export async function overwrite(urls: Array<string>): Promise<void> {
    await store.setList<string>('badger.storage.browse_urls', urls);
};