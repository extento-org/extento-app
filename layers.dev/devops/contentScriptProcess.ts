import worker from '@extento.browser/worker';
import subscribe from '@extento.browser/subscribe';

const contentScriptProcess = async () => {
    subscribe.devops(
        (data: any) => console.info(
            'subscription worked in devops', 
            data,
        ),
    );

    (setInterval(async () => {
        const response = await worker.devops.example();
        console.info('recieved a response in onload from devops', { response });
    }, 5000));
};

export default contentScriptProcess;
