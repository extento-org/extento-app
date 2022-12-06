import api from '@workspaces/.generated/lib/background_api';
import subscribe from '@_package/client/subscribe';

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
