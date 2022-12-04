import { WorkspaceName } from '@codegen/webpack.types';
import chrome_wrapper from '@extento/shared/chrome_wrapper';
import constants from '@extento/constants';

type Publisher = { [key in WorkspaceName]: Function };

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
