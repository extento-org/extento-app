import callWorker from '@extento.api/browser.callWorker';
import subscribe from '@extento.api/browser.subscribe';

const contentScriptProcess = async () => {
    subscribe.devops(
        (data: any) => console.info(
            'subscription worked in devops', 
            data,
        ),
    );

    (setInterval(async () => {
        const response = await callWorker.devops.example();
        console.info('recieved a response in onload from devops', { response });
    }, 5000));
};

export default contentScriptProcess;
