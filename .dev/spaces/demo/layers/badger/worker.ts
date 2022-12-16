import * as extension from './shared/extension';

chrome.alarms.onAlarm.addListener(async (alarm) => {
    if (alarm.name === extension.ALARM) {
        await extension.createTaskNotification();
    }
});