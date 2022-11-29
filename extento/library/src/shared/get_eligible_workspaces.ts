import { WorkspaceName, workspace_names } from '@codegen/webpack.workspaces';
import manifests from '@codegen/webpack.manifests';
import get_manifest_values from '@extento/shared/get_manifest_values';

const get_eligible_workspaces = (permissions: Array<string>): Array<WorkspaceName> => workspace_names
    .filter((workspace_name) => {
        const permissions_that_exist = get_manifest_values(workspace_name, 'permissions')
            .reduce((accum: any, manifest_permissions: any) => [...accum, ...manifest_permissions], [])
            .filter((manifest_permission: string) => permissions.includes(manifest_permission));

        return (
            permissions_that_exist.length
                === manifests[workspace_name].permissions.value.length
        );
    });

export default get_eligible_workspaces;
