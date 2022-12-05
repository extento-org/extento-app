import api from '@extento/lib/client/background_api';
import subscribe from '@extento/lib/client/subscribe';

const onload = async () => {
    try {
        subscribe.candidate(
            (data: any) => console.info(
                'subscription worked in TEMPLATE', 
                data,
            ),
        );

        (setInterval(async () => {
            const response = await api.candidate.example();
            console.info('recieved a response in onload from TEMPLATE', { response });
        }, 5000));
    } catch(err) {
        console.error(err);
    }
};

export default onload;
