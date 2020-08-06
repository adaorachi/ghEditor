const extendDefaults = (properties) => {
  const defaults = {
    inTextEmoji: true,
    buttonEmoji: true,
    width: '100%',
    minHeight: 'auto',
    maxHeight: 'auto',
    buttons: 'heading|bold|italic|quote|code|link|code-square|list-unordered|list-ordered|tasklist|mention',
    // buttonColor: 'red',
    frameStyles: {
      // fontSize: '30px',
      // color: 'red',
      // padding: '0.375rem 0.75rem',
    },
  };

  const concatframeStyle = { ...defaults.frameStyles, ...properties.frameStyles };

  Object.keys(properties).forEach((property) => {
    if (property !== 'frameStyles') {
      // eslint-disable-next-line no-prototype-builtins
      if (properties.hasOwnProperty(property)) {
        defaults[property] = properties[property];
      }
    } else {
      defaults[property] = concatframeStyle;
    }
  });

  return defaults;
};

const containerStyles = (properties, editorId) => {
  const textArea = document.querySelector(`textarea#${editorId}`);
  const options = extendDefaults(properties);
  const computedStyles = getComputedStyle(textArea);

  const computedFrameStyles = {
    fontSize: computedStyles.fontSize,
    color: computedStyles.color,
    fontFamily: computedStyles.fontFamily,
    margin: computedStyles.margin,
    padding: computedStyles.padding,
  };

  const defaultFrameStyles = { ...computedFrameStyles, ...options.frameStyles };

  const snipTextBody = document.querySelector(`.snip-write-${options.id}`);
  Object.assign(snipTextBody.style, defaultFrameStyles);
  const snipPreviewBody = document.querySelector(`.snip-preview-${options.id}`);
  Object.assign(snipPreviewBody.style, defaultFrameStyles);

  // eslint-disable-next-line no-prototype-builtins
  if (options.hasOwnProperty('buttonColor')) {
    const allButtons = document.querySelectorAll(`.snip-text-mark-down-${options.id} .buttons svg`);
    allButtons.forEach((button) => {
      button.style.fill = options.buttonColor;
    });
  }
};

const expandHeight = (textArea, defaultHeight) => {
  textArea.style.height = defaultHeight;
  const computed = window.getComputedStyle(textArea);
  const height = parseInt(computed.getPropertyValue('border-top-width'), 10)
    + textArea.scrollHeight
    + parseInt(computed.getPropertyValue('border-bottom-width'), 10);

  return height;
};

const setAttributeToEmojiSelected = (ele, arrayList) => {
  const array = document.querySelectorAll(arrayList);
  Array.from(array).forEach((item) => {
    if (item.id === ele) {
      item.setAttribute('aria-selected', true);
      item.classList.add('selected');
    } else {
      item.setAttribute('aria-selected', false);
      item.classList.remove('selected');
    }
  });
};

export {
  extendDefaults,
  containerStyles,
  expandHeight,
  setAttributeToEmojiSelected,
};