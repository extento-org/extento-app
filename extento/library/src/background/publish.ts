import { WorkspaceName } from '@codegen/webpack.workspaces';
import manifest_matches_check from '@extento/shared/manifest_matches_check';
import chrome_wrapper from '@extento/shared/chrome_wrapper';
import constants from '@extento/constants';

type Publisher = { [key in WorkspaceName]: Function };

const publish: any = new Proxy({}, {
    get: (_, workspace: WorkspaceName) => async (data: any) => {
        const active_tabs = await chrome_wrapper.get_active_tabs();
        const allowed_tabs = active_tabs
            .filter((tab: chrome.tabs.Tab) => manifest_matches_check(workspace, tab.url));

        allowed_tabs.forEach((tab) => chrome_wrapper.publish_to_tab({
            tab_id: tab.id,
            data,
            workspace,
            channel: constants.EXTENT_BACKGROUND_PUBLISHER,
        }));
    },
});

const _: Publisher = publish;

export default _;
