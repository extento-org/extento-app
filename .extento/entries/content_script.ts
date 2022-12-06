import mount_onload_script from '@extento.api/content.mount_onload_script';
import mount_react_script from '@extento.api/content.mount_react_script';
import run_worker_proxy from '@extento.api/content.run_worker_proxy';
import run_config_updater from '@extento.api/content.run_config_updater';

import './polyfill.js';

run_worker_proxy();
mount_onload_script();
mount_react_script();
run_config_updater();