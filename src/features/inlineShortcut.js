import cmdBlock from './buttonCommand/cmdBlock';

const inlineShortcut = (e, prop, textarea) => {
  function blockStyle(style) {
    const str = prop.blockStyles[style];
    const str2 = str.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`(${str2})([\\S\\s]*?)(${str2})`, 'g');
    return [str, regex];
  }

  const listShortCuts = {
    heading: 72,
    bold: 66,
    italic: 73,
    mention: 50,
    blockquote: 190,
    table: 51,
    strikethrough: 52,
    // 'horizontal-rule': 73,
    code: 192,
    'unordered-list': 85,
    'code-block': 222,
    'ordered-list': 79,
    tasklist: 189,
    link: 76,
    image: 77,
  };

  let id;
  const shiftSC = [51, 52];
  if (shiftSC.includes(id)) {
    id = e.ctrlKey && e.shiftKey && e.which;
  } else {
    id = e.ctrlKey && e.which;
  }

  if (prop.inlineShortcut) {
    cmdBlock(textarea, id, blockStyle, listShortCuts, e);
  }
};

export default inlineShortcut;
