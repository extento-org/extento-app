import config from '@_core/api/lib.use_config';

export default () => {
    // update the config cache immediately and then every 5 seconds
    config.update();
    setInterval(async () => {
        try {
            config.update();
        } catch(err) {
            console.error(err);
        }
    }, 10000);
};