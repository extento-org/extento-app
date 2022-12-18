import * as notification from '@app.shared/notification';
import * as alarm from '@app.shared/alarm';
import * as workerApi from './workerApi';

const ALARM_NAME: alarm.Alarm = 'badger.alarm.task';

const worker = () => {
    chrome.alarms.onAlarm.addListener((chromeAlarm) => {
        try {
            if (chromeAlarm.name === ALARM_NAME) {
                alarm.remove();
                // this function might throw
                // we could design around this but for now we just log it
                workerApi.failed();
                // must run after failed()
                // no need to notify if the above throws
                notification.create();
            }
        } catch(err) {
            console.error(err);
        }
    });
};

export default worker;