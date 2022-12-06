import api from '@workspaces/.generated/lib/background_api';
import subscribe from '@_package/client/subscribe';

const content_script_process = async () => {
    subscribe.tester(
        (data: any) => console.info(
            'subscription worked in tester', 
            data,
        ),
    );

    (setInterval(async () => {
        const response = await api.tester.example();
        console.info('recieved a response in onload from tester', { response });
    }, 5000));
};

export default content_script_process;
