import React from 'react';
import LayerUiOverlay from '@_core/react.layerUiOverlay';
import { UI_ORDERING, LayerName, LAYER_NAMES } from '@ex.compiled';
import renderShadowRoot from '@_core/content.renderShadowRoot';
import constants from '@_core/constants';
import GlobalContext from '@_core/react.contextGlobal';

export const getLayerId = (layer_name: LayerName) => `layer-${layer_name}-${constants.DOM_ID_SHADOW_ROOT}`;

function createLayerRoots(
    layer_context: {
        [key in LayerName]: any
    },
) {
    LAYER_NAMES.map((layer_name) => {
        const { FunctionalComponent } = layer_context[layer_name];
        return renderShadowRoot({
            id: getLayerId(layer_name),
            class: constants.DOM_ID_SHADOW_ROOT,
            children: (
                <GlobalContext>
                    <LayerUiOverlay offset={UI_ORDERING.indexOf(layer_name)}>
                        <FunctionalComponent />
                    </LayerUiOverlay>
                </GlobalContext>
            ),
        });
    });
}

export default createLayerRoots;
