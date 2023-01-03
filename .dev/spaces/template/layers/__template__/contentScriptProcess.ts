import worker from '@ex.browser/worker';

const contentScript = async () => {

    (setInterval(async () => {
        const response = await worker.__template__.example();
        console.info('recieved a response in onload from admin', { response });
    }, 5000));
};

export default contentScript;
