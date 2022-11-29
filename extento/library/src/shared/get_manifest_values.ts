import _ from 'lodash';
import manifests from '@codegen/webpack.manifests';
import { WorkspaceName } from '@codegen/webpack.workspaces';

const get_manifest_values = (workspace_name: WorkspaceName, manifest_section_name: string): Array<any> => {
    const inherits = _.get(manifests[workspace_name], `${manifest_section_name}.inherits`, false);

    if (inherits) {
        return Object.keys(manifests).map(
            (name: WorkspaceName) => _.get(manifests[name], `${manifest_section_name}.value`),
        );
    }

    return [
        _.get(manifests[workspace_name], `${manifest_section_name}.value`),
    ];
};

export default get_manifest_values;
