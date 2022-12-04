import api from '@extento/client/background_api';
import subscribe from '@extento/client/subscribe';

const onload = async () => {
    try {
        subscribe.manager(
            (data: any) => console.info(
                'subscription worked in TEMPLATE', 
                data,
            ),
        );

        (setInterval(async () => {
            const response = await api.manager.example();
            console.info('recieved a response in onload from TEMPLATE', { response });
        }, 5000));
    } catch(err) {
        console.error(err);
    }
};

export default onload;
