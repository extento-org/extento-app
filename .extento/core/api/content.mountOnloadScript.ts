import constants from '@_core/constants';

const mountOnloadScript = () => {
    // create the dom script that loads in layer functions
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL(constants.DIST_ONLOAD_FILE);
    (document.head || document.documentElement).appendChild(script);
};

export default mountOnloadScript;
