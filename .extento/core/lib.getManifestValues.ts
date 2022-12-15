import _ from 'lodash';
import { WorkspaceName, WORKSPACE_NAMES } from '@extento.types';

const getManifestValues = (
    manifests: { [key in WorkspaceName]: any },
    workspace_name: WorkspaceName,
    manifest_section_name: string,
): Array<any> => {
    const inherits = _.get(manifests[workspace_name], `${manifest_section_name}.inherits`, false);

    if (inherits) {
        return WORKSPACE_NAMES.map(
            (name: WorkspaceName) => _.get(manifests[name], `${manifest_section_name}.value`),
        );
    }

    return [
        _.get(manifests[workspace_name], `${manifest_section_name}.value`),
    ];
};

export default getManifestValues;
