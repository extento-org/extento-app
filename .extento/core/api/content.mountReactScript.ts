import constants from '@ex.compiled/constants';

const mountReactScript = () => {
    const reactUiScript = document.createElement('script');
    reactUiScript.setAttribute('defer', 'defer');
    reactUiScript.src = chrome.runtime.getURL(constants.DIST_UI);
    document.head.appendChild(reactUiScript);
};

export default mountReactScript;
