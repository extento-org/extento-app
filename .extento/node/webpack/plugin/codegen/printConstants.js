const fs = require('fs');

const constants = require('~/node/constants');

const padTSNoCheck = (str) => `// @ts-nocheck\n\n${str}`;

const printConstants = () => {
    const printCode = `export default ${JSON.stringify(constants, null, 4)} as const;`;
    fs.writeFileSync(
        constants.OUTPUT_PATH_INTERNAL_COMPILED_PUBLIC_CONSTANTS,
        padTSNoCheck(printCode),
    );
};

module.exports = printConstants;