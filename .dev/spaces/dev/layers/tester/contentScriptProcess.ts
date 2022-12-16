import worker from '@extento.browser/worker';
import subscribe from '@extento.browser/subscribe';

const contentScriptProcess = async () => {
    subscribe.tester(
        (data: any) => console.info(
            'subscription worked in tester', 
            data,
        ),
    );

    (setInterval(async () => {
        const response = await worker.tester.example();
        console.info('recieved a response in onload from tester', { response });
    }, 5000));
};

export default contentScriptProcess;
