import React from 'react';
import LayerUiOverlay from '@_core/ui/LayerOverlay';
import renderShadowRoot from '@_core/ui/renderShadowRoot';
import { UI_ORDERING, LayerName, LAYER_NAMES } from '@ex.compiled';
import constants from '@ex.compiled/constants';

function createLayerRoots(
    layer_context: {
        [key in LayerName]: any
    },
) {
    LAYER_NAMES.map((layer) => {
        const { FunctionalComponent } = layer_context[layer];
        return renderShadowRoot({
            id: constants.SELECTORS_LAYERS[layer].shadow_ui,
            class: constants.SELECTOR_DOM_CLASSNAME,
            children: (
                <LayerUiOverlay offset={UI_ORDERING.indexOf(layer)}>
                    <FunctionalComponent />
                </LayerUiOverlay>
            ),
        });
    });
}

export default createLayerRoots;
