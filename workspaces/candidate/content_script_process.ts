import api from '@extento/client/background_api';
import subscribe from '@extento/client/subscribe';

const content_script_process = async () => {
    subscribe.candidate(
        (data: any) => console.info(
            'subscription worked in candidate', 
            data,
        ),
    );

    (setInterval(async () => {
        const response = await api.candidate.example();
        console.info('recieved a response in onload from candidate', { response });
    }, 5000));
};

export default content_script_process;
