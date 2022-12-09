const fs = require('fs');
const zip_local = require('zip-local');

module.exports = (source, out) => zip_local.sync.zip(
    source.endsWith('/')
        ? source : source + '/'
).compress().save(out);