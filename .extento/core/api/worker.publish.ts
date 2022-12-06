import { WorkspaceName } from '@extento.types';
import chrome_wrapper from '@_core/lib.chrome';
import constants from '@_core/constants';
import { Publisher } from '@_core/common.types'

const publish: any = new Proxy({}, {
    get: (_, workspace: WorkspaceName) => async (data: any) => {
        const active_tabs = await chrome_wrapper.get_active_tabs();

        active_tabs.forEach((tab) => chrome_wrapper.publish_to_tab({
            tab_id: tab.id,
            data,
            workspace,
            channel: constants.EXTENT_BACKGROUND_PUBLISHER,
        }));
    },
});

const _: Publisher = publish;

export default _;
