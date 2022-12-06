import call_worker from '@extento.api/browser.call_worker';
import subscribe from '@extento.api/browser.subscribe';

const content_script_process = async () => {
    subscribe.candidate(
        (data: any) => console.info(
            'subscription worked in candidate', 
            data,
        ),
    );

    (setInterval(async () => {
        const response = await call_worker.candidate.example();
        console.info('recieved a response in onload from candidate', { response });
    }, 5000));
};

export default content_script_process;
