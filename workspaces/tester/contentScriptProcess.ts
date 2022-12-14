import callWorker from '@extento.api/browser.callWorker';
import subscribe from '@extento.api/browser.subscribe';

const contentScriptProcess = async () => {
    subscribe.tester(
        (data: any) => console.info(
            'subscription worked in tester', 
            data,
        ),
    );

    (setInterval(async () => {
        const response = await callWorker.tester.example();
        console.info('recieved a response in onload from tester', { response });
    }, 5000));
};

export default contentScriptProcess;
