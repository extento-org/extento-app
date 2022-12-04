import { WorkspaceName, workspace_names } from '@codegen/webpack.types';
import * as user_config from '@config';

// cast that shit
const _EXTENTO_APP_BUILD: any = process.env.EXTENTO_APP_BUILD;
const EXTENTO_APP_BUILD: user_config.Build = _EXTENTO_APP_BUILD;

export const is_allowed = (workspace: WorkspaceName) => {
    if (EXTENTO_APP_BUILD === 'MASTER') {
        return true;
    }
    return user_config.builds[EXTENTO_APP_BUILD].includes(workspace);
};

// this has to be a function otherwise we access values that aren't initialized
export default () => workspace_names.filter(name => workspace_allowed(name));