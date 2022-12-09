import _ from 'lodash';
import { WorkspaceName, workspace_names } from '@extento.types';

const get_manifest_values = (
    manifests: { [key in WorkspaceName]: any }, 
    workspace_name: WorkspaceName, 
    manifest_section_name: string
): Array<any> => {
    const inherits = _.get(manifests[workspace_name], `${manifest_section_name}.inherits`, false);

    if (inherits) {
        return workspace_names.map(
            (name: WorkspaceName) => _.get(manifests[name], `${manifest_section_name}.value`),
        );
    }

    return [
        _.get(manifests[workspace_name], `${manifest_section_name}.value`),
    ];
};

export default get_manifest_values;