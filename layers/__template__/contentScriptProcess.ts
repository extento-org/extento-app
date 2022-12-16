import worker from '@extento.browser/worker';
import subscribe from '@extento.browser/subscribe';

const contentScriptProcess = async () => {
    subscribe.__template__(
        (data: any) => console.info(
            'subscription worked in admin', 
            data,
        ),
    );

    (setInterval(async () => {
        const response = await worker.__template__.example();
        console.info('recieved a response in onload from admin', { response });
    }, 5000));
};

export default contentScriptProcess;
