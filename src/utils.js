const Utils = (() => {
  const extendDefaults = (properties) => {
    const defaults = {
      className: 'fade-and-drop',
      width: '100%',
      height: '100px',
      buttons: 'underline|bold|italic',
      buttonBgColor: '#eee',
      buttonColor: '#555',
      frameStyles: {
        border: '1px solid #ced4da',
        borderRadius: '0.25rem',
        color: '#495057',
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

  const concatClassName = (textarea) => {
    const classNames = textarea.classList;
    let concatClassName = '';
    classNames.forEach((className) => {
      if (className !== 'snip-write') { concatClassName += `${className} `; }
    });
    return concatClassName.trim();
  };

  const containerStyles = (properties) => {
    const textArea = document.querySelector('textarea#snip-write');
    const options = extendDefaults(properties);
    const computedStyles = getComputedStyle(textArea);

    const frameBorderColor = options.frameStyles.border;
    const frameBorderRadius = options.frameStyles.borderRadius;

    const textareaBorder = frameBorderColor || computedStyles.border;
    const radius = frameBorderRadius || computedStyles.borderRadius;

    const computedFrameStyles = {
      fontSize: computedStyles.fontSize,
      fontWeight: computedStyles.fontWeight,
      lineHeight: computedStyles.lineHeight,
      color: computedStyles.color,
      fontFamily: computedStyles.fontFamily,
      margin: computedStyles.margin,
    };

    const defaultFrameStyles = { ...computedFrameStyles, ...options.frameStyles };
    delete defaultFrameStyles.border;
    delete defaultFrameStyles.borderRadius;

    const buttonContainerStyles = {
      padding: '5px',
      backgroundColor: `${options.buttonBgColor}`,
      borderRadius: `${radius} ${radius} 0 0`,
      border: textareaBorder,
      display: 'flex',
      justifyContent: 'space-between',
      fontFamily: 'inherit',
    };

    const buttonStyles = {
      border: 'none',
      outline: 'none',
      backgroundColor: 'transparent',
      color: options.buttonColor,
    };

    const navTabs = {
      padding: '0 10px 10px',
      backgroundColor: '#fff',
      border: '1px solid #ccc',
      borderBottom: 'none',
    };

    const iframeStyles = {
      outline: 'none',
      border: textareaBorder,
      borderTop: 'none',
      borderRadius: `0 0 ${radius} ${radius}`,
      boxSizing: 'border-box',
    };

    const buttonContainer = document.querySelector('.snipText-button-container');
    Object.assign(buttonContainer.style, buttonContainerStyles);

    const iframeContainer = document.querySelector('.snipTextBody');
    Object.assign(iframeContainer.style, iframeStyles);

    const iframeBody = document.querySelector('.snipTextBody');
    Object.assign(iframeBody.style, defaultFrameStyles);

    const tabNavBtn = document.querySelector('.snipText-tabnav-tabs .tabnav');
    Object.assign(tabNavBtn.style, navTabs);

    const allButtons = document.querySelectorAll('.buttons');
    allButtons.forEach((button) => {
      Object.assign(button.style, buttonStyles);
    });
  };

  return { extendDefaults, concatClassName, containerStyles };
})();

export default Utils;