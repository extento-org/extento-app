import worker from '@ex.browser/worker';
import subscribe from '@ex.browser/subscribe';

const onload = async () => {
    try {
        subscribe.__template__(
            (data: any) => console.info(
                'subscription worked in TEMPLATE', 
                data,
            ),
        );

        (setInterval(async () => {
            const response = await worker.__template__.example();
            console.info('recieved a response in onload from TEMPLATE', { response });
        }, 5000));
    } catch(err) {
        console.error(err);
    }
};

export default onload;
