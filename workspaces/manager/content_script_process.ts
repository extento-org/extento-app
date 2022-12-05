import api from '@exento/lib/client/background_api';
import subscribe from '@exento/lib/client/subscribe';

const content_script_process = async () => {
    subscribe.manager(
        (data: any) => console.info(
            'subscription worked in manager', 
            data,
        ),
    );

    (setInterval(async () => {
        const response = await api.manager.example();
        console.info('recieved a response in onload from manager', { response });
    }, 5000));
};

export default content_script_process;
