import api from '@exento/lib/client/background_api';
import subscribe from '@exento/lib/client/subscribe';

const content_script_process = async () => {
    subscribe.devops(
        (data: any) => console.info(
            'subscription worked in devops', 
            data,
        ),
    );

    (setInterval(async () => {
        const response = await api.devops.example();
        console.info('recieved a response in onload from devops', { response });
    }, 5000));
};

export default content_script_process;
