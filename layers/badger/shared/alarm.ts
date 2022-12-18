import * as store from './store';

export type Alarm = 'badger.alarm.task';

/* --------------------------------- HELPERS -------------------------------- */
async function storeCreate(minutes: number): Promise<void> {
    await store.setNumber('badger.storage.alarm', minutes);
}

async function storeGet(): Promise<number> {
    const number = await store.getNumber('badger.storage.alarm');
    if (Number.isFinite(number)) {
        return number;
    }
    return 0;
}

async function storeUpdate(minutes: number): Promise<void> {
    await store.setNumber('badger.storage.alarm', minutes);
}

async function storeDelete(): Promise<void> {
    await store.remove('badger.storage.alarm');
};

async function alarmsClear(): Promise<void> {
    const alarm: Alarm = 'badger.alarm.task';
    await chrome.alarms.clear(String(alarm));
}

async function alarmsCreate(minutes: number): Promise<void> {
    const alarm: Alarm = 'badger.alarm.task';
    chrome.alarms.create(String(alarm), {
        delayInMinutes: minutes
    });
}

async function alarmsNew(minutes: number): Promise<void> {
    await alarmsClear();
    await alarmsCreate(minutes);
}

async function alarmsGetRemainingMinutes(): Promise<number> {
    const alarm: Alarm = 'badger.alarm.task';
    const { scheduledTime } = await chrome.alarms.get(String(alarm));
    return Math.ceil((scheduledTime - Date.now()) / 60000);
}

async function alarmsGetScheduledTime(): Promise<number> {
    const alarm: Alarm = 'badger.alarm.task';
    const { scheduledTime } = await chrome.alarms.get(String(alarm));
    return scheduledTime;
}

/* ----------------------------------- API ---------------------------------- */
export async function create(minutes: number): Promise<void> {
    await alarmsNew(minutes);
    await storeCreate(minutes);
};

export async function remove(): Promise<void> {
    // no need to clear alarms because it's called after the alarm fires!
    // the browser does the clearing for us
    await storeDelete();
};

export async function extend(minutes: number): Promise<number> {
    const remainingDurationInMinutes = await alarmsGetRemainingMinutes();
    const updatedRemainingMinutes = remainingDurationInMinutes + minutes;
    await alarmsNew(updatedRemainingMinutes);
    await storeUpdate(updatedRemainingMinutes);
    return updatedRemainingMinutes;
};

export async function pause(): Promise<void> {
    const remainingDurationInMinutes = await alarmsGetRemainingMinutes();
    await alarmsClear();
    await storeUpdate(remainingDurationInMinutes);
};

export async function resume(): Promise<void> {
    const remainingDurationInMinutes = await storeGet();
    // if it's zero, there is nothing to resume, return
    if (remainingDurationInMinutes === 0) {
        return;
    }
    await alarmsNew(remainingDurationInMinutes);
    await storeCreate(remainingDurationInMinutes);
};

export async function getDueTime(): Promise<number> {
    const time = await alarmsGetScheduledTime();
    return time;
}