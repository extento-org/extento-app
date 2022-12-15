import callWorker from '@extento.api/browser.callWorker';
import subscribe from '@extento.api/browser.subscribe';

const onload = async () => {
    try {
        subscribe.tester(
            (data: any) => console.info(
                'subscription worked in TEMPLATE', 
                data,
            ),
        );

        (setInterval(async () => {
            const response = await callWorker.tester.example();
            console.info('recieved a response in onload from TEMPLATE', { response });
        }, 5000));
    } catch(err) {
        console.error(err);
    }
};

export default onload;
