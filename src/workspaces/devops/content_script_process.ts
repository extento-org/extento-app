import api from '@extento/client/background_api';
import subscribe from '@extento/client/subscribe';

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
