import constants from '@_core/constants';

const mountReactScript = () => {
    const reactUiScript = document.createElement('script');
    reactUiScript.setAttribute('defer', 'defer');
    reactUiScript.src = chrome.runtime.getURL(constants.DIST_UI_FILE);
    document.head.appendChild(reactUiScript);
};

export default mountReactScript;
