import api from '@workspaces/.generated/lib/background_api';
import subscribe from '@_package/client/subscribe';

const content_script_process = async () => {
    subscribe.admin(
        (data: any) => console.info(
            'subscription worked in admin', 
            data,
        ),
    );

    (setInterval(async () => {
        const response = await api.admin.example();
        console.info('recieved a response in onload from admin', { response });
    }, 5000));
};

export default content_script_process;
