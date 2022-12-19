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

async function storePaused(paused: boolean): Promise<void> {
    await store.setNumber('badger.storage.paused', paused ? 1 : 2);
}

async function storeGetPaused(): Promise<boolean> {
    const num = await store.getNumber('badger.storage.paused');
    return num === 1;
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
    await storePaused(false);
};

export async function remove(): Promise<void> {
    await storeDelete();
    try {
        await alarmsClear();
    } catch (err) {
        console.error(err);
    }
};

export async function extend(minutes: number): Promise<void> {
    const paused = await storeGetPaused();
    if (paused) {
        await resume();
    }
    const remainingDurationInMinutes = await alarmsGetRemainingMinutes();
    const updatedRemainingMinutes = remainingDurationInMinutes + minutes;
    await alarmsNew(updatedRemainingMinutes);
    await storeUpdate(updatedRemainingMinutes);
};

export async function pause(): Promise<void> {
    const paused = await storeGetPaused();
    // if it's paused no logic needed
    if (paused) {
        return;
    }
    // non-existent alarms are not paused 
    // so we still need this check.
    const storeRemainingDurationInMinutes = await storeGet();
    // if it's zero, there is nothing to resume
    if (storeRemainingDurationInMinutes === 0) {
        return;
    }
    const remainingDurationInMinutes = await alarmsGetRemainingMinutes();
    await alarmsClear();
    await storeUpdate(remainingDurationInMinutes);
    await storePaused(true);
};

export async function resume(): Promise<void> {
    const paused = await storeGetPaused();
    // if it's not paused, there's nothing to resume
    if (!paused) {
        return;
    }
    const remainingDurationInMinutes = await storeGet();
    // this should never be zero!
    if (remainingDurationInMinutes === 0) {
        throw new Error('no duration was stored for this alarm')
    }
    await alarmsNew(remainingDurationInMinutes);
    await storeCreate(remainingDurationInMinutes);
    await storePaused(false);
};

export async function getDueTime(): Promise<number> {
    const time = await alarmsGetScheduledTime();
    return time;
};

export async function getPaused(): Promise<boolean> {
    const paused = await storeGetPaused();
    return paused;
};