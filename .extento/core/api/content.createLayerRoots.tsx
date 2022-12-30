import React from 'react';
import LayerUiOverlay from '@_core/react.layerUiOverlay';
import { UI_ORDERING, LayerName, LAYER_NAMES } from '@ex.compiled';
import constants from '@ex.compiled/constants';
import renderShadowRoot from '@_core/content.renderShadowRoot';
import GlobalContext from '@_core/react.contextGlobal';

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
                <GlobalContext>
                    <LayerUiOverlay offset={UI_ORDERING.indexOf(layer)}>
                        <FunctionalComponent />
                    </LayerUiOverlay>
                </GlobalContext>
            ),
        });
    });
}

export default createLayerRoots;
