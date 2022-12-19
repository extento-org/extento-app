import { LAYER_NAMES } from '@extento.types';

function defineWorkers(workers: any) {
    LAYER_NAMES.forEach((layer) => {
        workers[layer].default();
    });
}

export default defineWorkers;
