/* eslint-disable prefer-destructuring */
import switchCmd from './switchCmd';

const cmdBlock = (textarea, id, blockStyle, list, e) => {
  let snipReg;
  let snipSym;
  let synCon = '';
  let range;
  switch (id) {
    case list.heading:
      snipReg = new RegExp(/(###)([\S\s]*?)/, 'g');
      snipSym = '### ';
      range = [4, 0];
      break;
    case list.bold:
      snipReg = blockStyle('bold')[1];
      snipSym = blockStyle('bold')[0];
      range = [2, 2];
      break;
    case list.italic:
      snipReg = blockStyle('italic')[1];
      snipSym = blockStyle('italic')[0];
      range = [1, 1];
      break;
    case list.mention:
      snipReg = new RegExp(/(@)([\S\s]*?)/, 'g');
      snipSym = '@';
      range = [1, 0];
      break;
    case list.blockquote:
      snipReg = new RegExp(/(>\s)([\S\s]*?)/, 'g');
      snipSym = '> ';
      range = [2, 0];
      break;
    case list.table:
      snipReg = null;
      synCon = '';
      synCon += '\n| Default-aligned | Left-aligned | Center-aligned  | Right-aligned  |';
      synCon += '\n|-----------------|:-------------|:---------------:|---------------:|';
      synCon += '\n| First-row cell-1 | cell-2  | cell-3      | cell-4    |';
      synCon += '\n| Second-row cell-1 | cell-2  | cell-3      | cell-4    |';
      synCon += '\n| Third-row cell-1 | cell-2  | cell-3      | cell-4    |\n';
      snipSym = synCon;
      range = [0, 0];
      break;
    case list.strikethrough:
      snipReg = new RegExp(/(~~)([\S\s]*?)(~~)/, 'g');
      snipSym = '~~';
      range = [2, 2];
      break;
    case list['horizontal-rule']:
      snipReg = null;
      snipSym = '---';
      range = [4, 0];
      break;
    case list.code:
      snipReg = new RegExp(/(`)([\S\s]*?)(`)/, 'g');
      snipSym = '`';
      range = [1, 1];
      break;
    case list['unordered-list']:
      snipReg = new RegExp(/(-\s)([\S\s]*?)/, 'g');
      snipSym = '- ';
      range = [2, 0];
      break;
    case list['code-block']:
      snipReg = blockStyle('code-block')[1];
      snipSym = blockStyle('code-block')[0];
      range = [3, 3];
      break;
    case list['ordered-list']:
      snipReg = new RegExp(/(1.\s)([\S\s]*?)/, 'g');
      snipSym = '1. ';
      range = [3, 0];
      break;
    case list.tasklist:
      snipReg = new RegExp(/(-\s\[\s\]\s)([\S\s]*?)/, 'g');
      snipSym = '- [ ] ';
      range = [6, 0];
      break;
    case list.link:
      snipReg = new RegExp(/\[(.*?)\]\((.*?)\)(.*)/, 'g');
      snipSym = '';
      range = [1, 4];
      break;
    case list.image:
      snipReg = new RegExp(/!\[(.*?)\]\((.*?)\)(.*)/, 'g');
      snipSym = '';
      range = [1, 4];
      break;
    default:
      break;
  }

  if (range === undefined) {
    return;
  }

  switchCmd(textarea, snipReg, snipSym, range, list, id);

  e.preventDefault();
};

export default cmdBlock;