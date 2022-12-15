import React from 'react';
import LayerUiOverlay from '@_core/react.layerUiOverlay';
import { UI_ORDERING, LayerName, LAYER_NAMES } from '@extento.types';
import { CodegenStyles } from '@_core/common.types';
import render_shadow_root from '@_core/content.renderShadowRoot';
import constants from '@_core/constants';
import GlobalContext from '@_core/react.contextGlobal';

const sharedCss = require('@_styles/global.css');
const layersCss = require('@_styles/layers.css');
const sharedScss = require('@_styles/global.scss');
const layersScss = require('@_styles/layers.scss');

export const getLayerId = (layer_name: LayerName) => `${layer_name}-${constants.DOM_ID_SHADOW_ROOT}`;

function createLayerRoots(
    layer_context: {
        [key in LayerName]: any
    },
    styles: CodegenStyles,
) {
    LAYER_NAMES.map((layer_name) => {
        const { css, scss } = styles[layer_name];
        const { FunctionalComponent } = layer_context[layer_name];
        return render_shadow_root({
            css: `${sharedCss}\n\n${sharedScss}\n\n${layersCss}\n\n${layersScss}\n\n${css}\n\n${scss}`,
            id: getLayerId(layer_name),
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
