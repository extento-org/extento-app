import { WorkspaceName } from '@extento.types';
import chromeWrapper from '@_core/lib.chrome';
import constants from '@_core/constants';
import { Publisher } from '@_core/common.types';

const publish: any = new Proxy({}, {
    get: (_, workspace: WorkspaceName) => async (data: any) => {
        const activeTabs = await chromeWrapper.getActiveTabs();

        activeTabs.forEach((tab) => chromeWrapper.publishToTab({
            tab_id: tab.id,
            data,
            workspace,
            channel: constants.EXTENT_BACKGROUND_PUBLISHER,
        }));
    },
});

const defaultExport: Publisher = publish;

export default defaultExport;
