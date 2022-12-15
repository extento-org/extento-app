import worker from '@extento.browser/worker';
import subscribe from '@extento.browser/subscribe';

const contentScriptProcess = async () => {
    subscribe.candidate(
        (data: any) => console.info(
            'subscription worked in candidate', 
            data,
        ),
    );

    (setInterval(async () => {
        const response = await worker.candidate.example();
        console.info('recieved a response in onload from candidate', { response });
    }, 5000));
};

export default contentScriptProcess;
