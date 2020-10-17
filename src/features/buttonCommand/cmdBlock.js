/* eslint-disable prefer-destructuring */
import switchCmd from './switchCmd';

const cmdBlock = (textarea, id, blockStyle, list, e) => {
  let gheditorReg;
  let gheditorSym;
  let synCon = '';
  let range;
  switch (id) {
    case list.heading:
      gheditorReg = new RegExp(/(###)([\S\s]*?)/, 'g');
      gheditorSym = '### ';
      range = [4, 0];
      break;
    case list.bold:
      gheditorReg = blockStyle('bold')[1];
      gheditorSym = blockStyle('bold')[0];
      range = [2, 2];
      break;
    case list.italic:
      gheditorReg = blockStyle('italic')[1];
      gheditorSym = blockStyle('italic')[0];
      range = [1, 1];
      break;
    case list.mention:
      gheditorReg = new RegExp(/(@)([\S\s]*?)/, 'g');
      gheditorSym = '@';
      range = [1, 0];
      break;
    case list.blockquote:
      gheditorReg = new RegExp(/(>\s)([\S\s]*?)/, 'g');
      gheditorSym = '> ';
      range = [2, 0];
      break;
    case list.table:
      gheditorReg = null;
      synCon = '';
      synCon += '\n| Default-aligned | Left-aligned | Center-aligned  | Right-aligned  |';
      synCon += '\n|-----------------|:-------------|:---------------:|---------------:|';
      synCon += '\n| First-row cell-1 | cell-2  | cell-3      | cell-4    |';
      synCon += '\n| Second-row cell-1 | cell-2  | cell-3      | cell-4    |';
      synCon += '\n| Third-row cell-1 | cell-2  | cell-3      | cell-4    |\n';
      gheditorSym = synCon;
      range = [0, 0];
      break;
    case list.strikethrough:
      gheditorReg = new RegExp(/(~~)([\S\s]*?)(~~)/, 'g');
      gheditorSym = '~~';
      range = [2, 2];
      break;
    case list['horizontal-rule']:
      gheditorReg = null;
      gheditorSym = '---';
      range = [4, 0];
      break;
    case list.code:
      gheditorReg = new RegExp(/(`)([\S\s]*?)(`)/, 'g');
      gheditorSym = '`';
      range = [1, 1];
      break;
    case list['unordered-list']:
      gheditorReg = new RegExp(/(-\s)([\S\s]*?)/, 'g');
      gheditorSym = '- ';
      range = [2, 0];
      break;
    case list['code-block']:
      gheditorReg = blockStyle('code-block')[1];
      gheditorSym = blockStyle('code-block')[0];
      range = [3, 3];
      break;
    case list['ordered-list']:
      gheditorReg = new RegExp(/(1.\s)([\S\s]*?)/, 'g');
      gheditorSym = '1. ';
      range = [3, 0];
      break;
    case list.tasklist:
      gheditorReg = new RegExp(/(-\s\[\s\]\s)([\S\s]*?)/, 'g');
      gheditorSym = '- [ ] ';
      range = [6, 0];
      break;
    case list.link:
      gheditorReg = new RegExp(/\[(.*?)\]\((.*?)\)(.*)/, 'g');
      gheditorSym = '';
      range = [1, 4];
      break;
    case list.image:
      gheditorReg = new RegExp(/!\[(.*?)\]\((.*?)\)(.*)/, 'g');
      gheditorSym = '';
      range = [1, 4];
      break;
    default:
      break;
  }

  if (range === undefined) {
    return;
  }

  switchCmd(textarea, gheditorReg, gheditorSym, range, list, id);

  e.preventDefault();
};

export default cmdBlock;