import api from '@workspaces/.generated/lib/background_api';
import subscribe from '@_package/client/subscribe';

const onload = async () => {
    try {
        subscribe.tester(
            (data: any) => console.info(
                'subscription worked in TEMPLATE', 
                data,
            ),
        );

        (setInterval(async () => {
            const response = await api.tester.example();
            console.info('recieved a response in onload from TEMPLATE', { response });
        }, 5000));
    } catch(err) {
        console.error(err);
    }
};

export default onload;
