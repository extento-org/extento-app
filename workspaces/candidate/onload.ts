import call_worker from '@extento.api/browser.call_worker';
import subscribe from '@extento.api/browser.subscribe';

const onload = async () => {
    try {
        subscribe.candidate(
            (data: any) => console.info(
                'subscription worked in TEMPLATE', 
                data,
            ),
        );

        (setInterval(async () => {
            const response = await call_worker.candidate.example();
            console.info('recieved a response in onload from TEMPLATE', { response });
        }, 5000));
    } catch(err) {
        console.error(err);
    }
};

export default onload;
