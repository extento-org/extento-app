import callWorker from '@extento.api/browser.callWorker';
import subscribe from '@extento.api/browser.subscribe';

const contentScriptProcess = async () => {
    subscribe.manager(
        (data: any) => console.info(
            'subscription worked in manager', 
            data,
        ),
    );

    (setInterval(async () => {
        const response = await callWorker.manager.example();
        console.info('recieved a response in onload from manager', { response });
    }, 5000));
};

export default contentScriptProcess;
