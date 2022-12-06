import call_worker from '@extento.api/browser.call_worker';
import subscribe from '@extento.api/browser.subscribe';

const content_script_process = async () => {
    subscribe.admin(
        (data: any) => console.info(
            'subscription worked in admin', 
            data,
        ),
    );

    (setInterval(async () => {
        const response = await call_worker.admin.example();
        console.info('recieved a response in onload from admin', { response });
    }, 5000));
};

export default content_script_process;
