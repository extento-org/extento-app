import constants from "@_core/constants";

export default () => {
    // create the dom script that loads in workspace functions
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL(constants.DIST_ONLOAD_FILE);
    (document.head || document.documentElement).appendChild(script);
};