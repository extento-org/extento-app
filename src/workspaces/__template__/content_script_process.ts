import api from '@extento/client/background_api';
import subscribe from '@extento/client/subscribe';

const content_script_process = async () => {
    subscribe.__template__(
        (data: any) => console.info(
            'subscription worked in __template__', 
            data,
        ),
    );

    (setInterval(async () => {
        const response = await api.__template__.example();
        console.info('recieved a response in onload from __template__', { response });
    }, 5000));
};

export default content_script_process;
