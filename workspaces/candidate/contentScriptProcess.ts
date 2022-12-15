import callWorker from '@extento.api/browser.callWorker';
import subscribe from '@extento.api/browser.subscribe';

const contentScriptProcess = async () => {
    subscribe.candidate(
        (data: any) => console.info(
            'subscription worked in candidate', 
            data,
        ),
    );

    (setInterval(async () => {
        const response = await callWorker.candidate.example();
        console.info('recieved a response in onload from candidate', { response });
    }, 5000));
};

export default contentScriptProcess;
