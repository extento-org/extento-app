import call_worker from '@extento.api/browser.call_worker';
import subscribe from '@extento.api/browser.subscribe';

const content_script_process = async () => {
    subscribe.tester(
        (data: any) => console.info(
            'subscription worked in tester', 
            data,
        ),
    );

    (setInterval(async () => {
        const response = await call_worker.tester.example();
        console.info('recieved a response in onload from tester', { response });
    }, 5000));
};

export default content_script_process;
