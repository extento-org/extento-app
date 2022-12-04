const validate = require('../validate');
const { USER_CONFIG_PATH } = require('../constants');

validate.user_config(require(USER_CONFIG_PATH));