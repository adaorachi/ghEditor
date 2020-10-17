const indentTab = (event, textarea, prop) => {
  if (prop.indentWithTab) {
    if (event.keyCode === 9) {
      const v = textarea.value;
      const s = textarea.selectionStart;
      const e = textarea.selectionEnd;
      textarea.value = `${v.substring(0, s)}\t${v.substring(e)}`;
      textarea.selectionStart = s + '\t'.length;
      textarea.selectionEnd = s + '\t'.length;
      event.preventDefault();
    }
  }
};

export default indentTab;