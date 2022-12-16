import worker from '@extento.browser/worker';
import subscribe from '@extento.browser/subscribe';

const contentScriptProcess = async () => {
    subscribe.manager(
        (data: any) => console.info(
            'subscription worked in manager', 
            data,
        ),
    );

    (setInterval(async () => {
        const response = await worker.manager.example();
        console.info('recieved a response in onload from manager', { response });
    }, 5000));
};

export default contentScriptProcess;
