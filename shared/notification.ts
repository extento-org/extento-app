export type NotificationId = 'badger.notification';

/* ----------------------------------- API ---------------------------------- */
export function create(): void {
    const id: NotificationId = 'badger.notification';
    chrome.notifications.create(String(id), {
        title: 'The Badger Got You!',
        message: 'You failed to complete your self assigned badger task. Open a new tab to see more about this task.',
        iconUrl: '',
        type: 'basic'
    });
};