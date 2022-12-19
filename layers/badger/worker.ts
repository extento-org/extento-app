import * as alarm from '@app.shared/alarm';
import * as workerApi from './workerApi';

const ALARM_NAME: alarm.Alarm = 'badger.alarm.task';

const handleAlarm = async () => {
    await workerApi.failed();
};

const worker = () => {
    chrome.alarms.onAlarm.addListener((chromeAlarm) => {
        try {
            if (chromeAlarm.name === ALARM_NAME) {
                handleAlarm();
            }
        } catch(err) {
            console.error(err);
        }
    });
};

export default worker;