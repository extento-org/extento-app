import { WorkspaceName } from '@codegen/webpack.types';
import * as user_config from '@config';

const workspace_allowed = (workspace: WorkspaceName) => {
    if (user_config.EXTENTO_APP_BUILD === 'MASTER') {
        return true;
    }
    
    return user_config.builds[user_config.EXTENTO_APP_BUILD].includes(workspace);
};

function typed_stub<ModuleType>(mod: any, workspace: WorkspaceName, stub: any): ModuleType {
    if (workspace_allowed(workspace)) {
        const typed_mod: ModuleType = mod;
        return typed_mod;
    }
    const stub_mod: any = stub;
    const fake_typed_mod: ModuleType = stub_mod;
    return fake_typed_mod;
};

export function onload<ModuleType>(workspace: WorkspaceName, mod: any): ModuleType {
    return typed_stub<ModuleType>(mod, workspace, (): any => null);
};

export function ui<ModuleType>(workspace: WorkspaceName, mod: any): ModuleType {
    return typed_stub<ModuleType>(mod, workspace, (): any => null);
};

export function content_script_process<ModuleType>(workspace: WorkspaceName, mod: any): ModuleType {
    return typed_stub<ModuleType>(mod, workspace, (): any => null);
};

export function config<ModuleType>(workspace: WorkspaceName, mod: any): ModuleType {
    return typed_stub<ModuleType>(mod, workspace, (): any => ({}));
};

export function manifest<ModuleType>(workspace: WorkspaceName, mod: any): ModuleType {
    return typed_stub<ModuleType>(mod, workspace, mod);
};

export function background_api<ModuleType>(workspace: WorkspaceName, mod: any): ModuleType {
    return typed_stub<ModuleType>(mod, workspace, new Proxy({}, {
        get: () => () => {
            throw new Error(
                `Cannot call background for workspace: ${workspace} in build: ${user_config.EXTENTO_APP_BUILD}`
            );
        }
    }));
};