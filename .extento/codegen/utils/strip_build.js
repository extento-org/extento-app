import { selective_builds, ACTIVE_SELECTIVE_BUILD } from '@codegen/webpack.types';
function typed_stub(mod, workspace, stub) {
    if (selective_builds[ACTIVE_SELECTIVE_BUILD].includes(workspace)) {
        const typed_mod = mod;
        return typed_mod;
    }
    const stub_mod = stub;
    const fake_typed_mod = stub_mod;
    return fake_typed_mod;
}
;
export function onload(workspace, mod) {
    return typed_stub(mod, workspace, () => null);
}
;
export function ui(workspace, mod) {
    return typed_stub(mod, workspace, () => null);
}
;
export function content_script_process(workspace, mod) {
    return typed_stub(mod, workspace, () => null);
}
;
export function config(workspace, mod) {
    return typed_stub(mod, workspace, () => ({}));
}
;
export function manifest(workspace, mod) {
    return typed_stub(mod, workspace, mod);
}
;
export function background_api(workspace, mod) {
    return typed_stub(mod, workspace, new Proxy({}, {
        get: () => () => {
            throw new Error(`Cannot call background for workspace: ${workspace} in build: ${'SELECTIVE_BUILD'}`);
        }
    }));
}
;
