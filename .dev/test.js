const val = `ajsbfkjahs asdfasdf
    and asydgfuakhsdfb asdfasdf remaining`;


const stripTabs = (str) => str.replaceAll('\t', '').replaceAll('\n', '');


console.log(stripTabs(val));