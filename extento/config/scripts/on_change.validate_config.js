const validators = require('../validators');
const { APP_CONFIG_PATH } = require('../constants');

const validation_error = validators.app_config(require(APP_CONFIG_PATH));

if (validation_error) {
    throw validation_error;
}