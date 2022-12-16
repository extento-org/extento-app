/* -------------------------------------------------------------------------- */
/*                     TRIGGER WARNING: THIS CODE IS SHIT!                    */
/* -------------------------------------------------------------------------- */

const path = require('path');
const fs = require('fs');
const markdown_toc = require('markdown-toc');

const { PATH_APP } = require('./utils');

const TERMINATION_STRING = 'EXTENTO_README_END';
const STRIP_STRING = '[//]: # (EXTENTO_README_SITE_ONLY)';
const PATH_TO_DOCS = path.resolve(PATH_APP, 'docs');
const PATH_TO_APP_README = path.resolve(PATH_APP, 'README.md');
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

const id_fix_timestamp = Date.now();

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
            .map(line => line.trim().startsWith('## ') ? (
                ` ## <h2 id="${extract_header_to_id(str, line)}-${id_fix_timestamp}">${line.replaceAll('#', '').trim()}</h2>`
            ) : line)
            .map(line => line.startsWith('# ') ? (
                `# <h1 id="${extract_header_to_id(str)}-${id_fix_timestamp}">${line.replaceAll('#', '').trim()}</h1>`
            ) : line)
            .join('\n')
    ))

const translated_readme = readmes.join('\n\n')
    .replaceAll('(docs/', '(#')
    .replaceAll('?id=', '-');

const table_of_contents = markdown_toc(translated_readme, {
    stripHeadingTags: false
}).content;

const translated_toc = table_of_contents 
    .replaceAll('#h1-id', '#')
    .replaceAll('#h2-id', '#')
    .replaceAll('h1)', ')')
    .replaceAll('h2)', ')')
    .split('\n')
    .map(line => {
        if (line.includes(id_fix_timestamp)) {
            const [id, ...rest] = line.split(')');
            return [id.split('-' + id_fix_timestamp)[0], ...rest].join(')')
        }
        return line;
    })
    .join('\n')

const with_timestamps = repo_readme_header + '\n\n' + translated_toc + '\n\n' + translated_readme;

const final_readme = with_timestamps
    .replaceAll('-' + id_fix_timestamp, '')
    .split('\n' + STRIP_STRING)
    .map((str, i) => i % 2 === 1 ? null : str)
    .filter(str => typeof str === 'string')
    .join('');

fs.writeFileSync(PATH_TO_APP_README, final_readme);
