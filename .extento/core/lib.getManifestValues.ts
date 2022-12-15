import _ from 'lodash';
import { LayerName, LAYER_NAMES } from '@extento.types';

const getManifestValues = (
    manifests: { [key in LayerName]: any },
    layer_name: LayerName,
    manifest_section_name: string,
): Array<any> => {
    const inherits = _.get(manifests[layer_name], `${manifest_section_name}.inherits`, false);

    if (inherits) {
        return LAYER_NAMES.map(
            (name: LayerName) => _.get(manifests[name], `${manifest_section_name}.value`),
        );
    }

    return [
        _.get(manifests[layer_name], `${manifest_section_name}.value`),
    ];
};

export default getManifestValues;
