const getComputedStyles = (editorId) => {
  const textArea = document.querySelector(`textarea.${editorId}`);
  const computedStyles = getComputedStyle(textArea);

  return {
    fontSize: computedStyles.fontSize,
    color: computedStyles.color,
    fontFamily: computedStyles.fontFamily,
    margin: computedStyles.margin,
    padding: computedStyles.padding,
  };
};

const containerStyles = (options, editorId) => {
  const computedFrameStyles = getComputedStyles(editorId);

  const defaultFrameStyles = { ...computedFrameStyles, ...options.frameStyles };

  [`.gheditor-write-${options.container}`, `.gheditor-preview-${options.container}`].forEach(ele => {
    Object.assign(document.querySelector(ele).style, defaultFrameStyles);
  });

  [`gheditor-writearea-tab-${editorId}`, `gheditor-preview-tab-${editorId}`].forEach(tab => {
    document.getElementById(tab).style.fontFamily = defaultFrameStyles.fontFamily;
  });

  document.querySelector(`.filter-emoji-area-${editorId}`).style.fontFamily = defaultFrameStyles.fontFamily;
};

const expandHeight = (textArea, defaultHeight) => {
  textArea.style.height = defaultHeight;
  const computed = window.getComputedStyle(textArea);
  const height = parseInt(computed.getPropertyValue('border-top-width'), 10)
    + textArea.scrollHeight
    + parseInt(computed.getPropertyValue('border-bottom-width'), 10);
  return height;
};

export { containerStyles, expandHeight };