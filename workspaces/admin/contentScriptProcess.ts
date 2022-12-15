import callWorker from '@extento.api/browser.callWorker';
import subscribe from '@extento.api/browser.subscribe';

const contentScriptProcess = async () => {
    subscribe.admin(
        (data: any) => console.info(
            'subscription worked in admin', 
            data,
        ),
    );

    (setInterval(async () => {
        const response = await callWorker.admin.example();
        console.info('recieved a response in onload from admin', { response });
    }, 5000));
};

export default contentScriptProcess;
