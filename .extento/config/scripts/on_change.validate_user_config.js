const validate = require('../validate');

const { 
    PATH_APP_CONFIG 
} = require('../constants');

validate.user_config(require(PATH_APP_CONFIG));
