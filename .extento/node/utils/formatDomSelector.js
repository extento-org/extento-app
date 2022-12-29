const formatDomSelector = (str) => str
    .replace(/^[^a-z]+|[^\w:.-]+/gi, "")

module.exports = formatDomSelector;