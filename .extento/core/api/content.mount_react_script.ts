import constants from "@_core/constants";

export default () => {
    const react_ui_script = document.createElement('script');
    react_ui_script.setAttribute('defer', 'defer');
    react_ui_script.src = chrome.runtime.getURL(constants.DIST_UI_FILE);
    document.head.appendChild(react_ui_script);
};