import { LAYER_NAMES } from '@ex.compiled';

function defineWorkers(workers: any) {
    LAYER_NAMES.forEach((layer) => {
        workers[layer].default();
    });
}

export default defineWorkers;
