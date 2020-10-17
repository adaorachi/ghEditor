const switchCmd = (textarea, snipReg, snipSym, range, list, id) => {
  let start = textarea.selectionStart;
  let end = textarea.selectionEnd;
  const selectMode = (start === end) ? 'end' : 'preserve';
  let selected = textarea.value.slice(start, end);

  const selection2 = textarea.value.slice(start - range[0], end + range[1]);

  if (selected.match(snipReg)) {
    selected = selected.replace(snipReg, (_, p1, p2) => ((id === list.link || id === list.image) ? p1.replace(/\[/, '') + p2.replace(p2, ' ') : p2));
  } else if (selection2.match(snipReg)) {
    start = textarea.selectionStart - range[0];
    end = textarea.selectionEnd + range[1];
  } else if ([list.bold, list.italic, list.code, list.strikethrough].includes(id)) {
    selected = `${snipSym}${selected.trim()}${snipSym} `;
  } else if (id === list['code-block']) {
    selected = `${snipSym}\n${selected.trim()}\n${snipSym} `;
  } else if (id === list.link) {
    selected = `[${selected.trim()}](url) `;
  } else if (id === list.image) {
    selected = `![${selected.trim()}](image_url) `;
  } else {
    selected = `${snipSym}${selected}`;
  }
  textarea.focus();
  textarea.setRangeText(selected.trim(), start, end, selectMode);
};

export default switchCmd;