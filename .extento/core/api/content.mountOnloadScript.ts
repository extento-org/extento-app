import constants from '@ex.compiled/constants';

const mountOnloadScript = () => {
    // create the dom script that loads in layer functions
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL(constants.DIST_ONLOAD);
    (document.head || document.documentElement).appendChild(script);
};

export default mountOnloadScript;
