import api from '@exento/lib/client/background_api';
import subscribe from '@exento/lib/client/subscribe';

const onload = async () => {
    try {
        subscribe.devops(
            (data: any) => console.info(
                'subscription worked in TEMPLATE', 
                data,
            ),
        );

        (setInterval(async () => {
            const response = await api.devops.example();
            console.info('recieved a response in onload from TEMPLATE', { response });
        }, 5000));
    } catch(err) {
        console.error(err);
    }
};

export default onload;
