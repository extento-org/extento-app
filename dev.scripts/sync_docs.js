const path = require('path');
const fs = require('fs');
const markdown_toc = require('markdown-toc');

const TERMINATION_STRING = 'EXTENTO_README_END';
const PATH_TO_DOCS = path.resolve(__dirname, '../dev.docs');
const PATH_TO_APP_README = path.resolve(__dirname, '../README.md');
const EXTRA_README_FILENAME = '.repo.md';

if (!fs.existsSync(PATH_TO_DOCS)) 
    throw new Error(`${PATH_TO_DOCS} does not exist.`);

if (!fs.existsSync(PATH_TO_APP_README)) 
    throw new Error(`${PATH_TO_APP_README} does not exist.`);

const sidebar = fs.readFileSync(path.resolve(PATH_TO_DOCS, '_sidebar.md'), 'utf-8');

const repo_readme_header = fs.readFileSync(
    path.resolve(PATH_TO_DOCS, 'docs', EXTRA_README_FILENAME),
    'utf-8'
);

const header_to_id = header => header.replaceAll('#', '').trim().split(' ').join('-')

const extract_header_to_id = (str, subheader_line = '') => (
    header_to_id(str.split('\n')[0])
        + (
            subheader_line ? (
                '-' + header_to_id(subheader_line)
            ) : ''
        )
).toLowerCase();

const readmes = sidebar.split(TERMINATION_STRING)[0].split('\n')
    .filter(line => line.trim().startsWith('- ['))
    .map(str => str.split('](')[1].split(')')[0])
    .map(str => str.split('/'))
    .map((_path) => fs.readFileSync(
        path.resolve(PATH_TO_DOCS, ..._path), 
        'utf-8'
    ))
    .map(str => str.trim())
    .map(str => (
        str.split('\n')
            .map(line => line.startsWith('## ') ? (
                `## <a id="${extract_header_to_id(str, line)}">${line.replaceAll('#', '').trim()}</a>`
            ) : line)
            .map(line => line.startsWith('# ') ? (
                `# <a id="${extract_header_to_id(str)}">${line.replaceAll('#', '').trim()}</a>`
            ) : line)
            .join('\n')
    ))

const translated_readme = readmes.join('\n\n')
    .replaceAll('(docs/', '(#')
    .replaceAll('?id=', '-');


const table_of_contents = markdown_toc(translated_readme, {
    withLinks: true,
    stripHeadingTags: false
}).content;;
const final_readme = repo_readme_header + '\n\n' + table_of_contents + '\n\n' + translated_readme;

fs.writeFileSync(PATH_TO_APP_README, final_readme);
