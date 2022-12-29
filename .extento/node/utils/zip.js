const zipLocal = require('zip-local');

module.exports = (source, out) => zipLocal
    .sync
    .zip(source.endsWith('/') ? source : `${source}/`)
    .compress()
    .save(out);
