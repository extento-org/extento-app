import worker from '@ex.browser/worker';

const onload = async () => {
    try {
        (setInterval(async () => {
            const response = await worker.__template__.example();
            console.info('recieved a response in onload from TEMPLATE', { response });
        }, 5000));
    } catch(err) {
        console.error(err);
    }
};

export default onload;
