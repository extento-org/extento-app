const fs = require('fs');

const constants = require('~/node/constants');

const padTSNoCheck = (str) => `// @ts-nocheck\n\n${str}`;

const printConstants = () => {
    const manifestJson = require(constants.OUTPUT_PATH_APP_EXTENSION_MANIFEST);
    const printCode = `export default ${JSON.stringify(manifestJson, null, 4)} as const;`;
    fs.writeFileSync(
        constants.OUTPUT_PATH_INTERNAL_COMPILED_PUBLIC_MANIFEST,
        padTSNoCheck(printCode),
    );
};

module.exports = printConstants;