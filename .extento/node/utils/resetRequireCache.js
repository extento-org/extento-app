const resetRequireCache = () => Object.keys(require.cache).forEach((key) => {
    delete require.cache[key];
});

module.exports = resetRequireCache;
