import { library, icon } from '@fortawesome/fontawesome-svg-core';
import {
  faBold, faUnderline, faItalic,
  faStrikethrough, faHeading, faQuoteLeft,
  faCode, faLink, faListUl,
  faListOl, faCheckSquare, faQuestionCircle,
} from '@fortawesome/free-solid-svg-icons';

library.add(
  faBold, faUnderline, faItalic,
  faStrikethrough, faHeading, faQuoteLeft,
  faCode, faLink, faListUl,
  faListOl, faCheckSquare, faQuestionCircle,
);

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

  const displayButtons = (properties) => {
    const docFrag = document.querySelector('.snipText-button-container');

    let content = '';
    content += `<div class="snipText-tabnav-tabs" id="snipText-tabnav-tabs" style="margin: 0 10px">
                  <span class="btn-nav tabnav write-tab-nav active" id="snip-write-tab">Write</span>
                  <span class="btn-nav tabnav preview-tab-nav" id="snip-preview-tab">Preview</span>
                </div>`;

    const mainButtons = extendDefaults(properties).buttons;
    content += '<div>';
    mainButtons.split('|').forEach((button, index) => {
      const iconName = button.trim();
      const prefix = 'fas';

      const isIcon = icon({ prefix, iconName });

      if (isIcon !== undefined) {
        const iconFont = isIcon.html;
        let buttonContent;
        if (iconName === 'question-circle') {
          buttonContent = `<a href="https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet" target="_blank" title="help">${iconFont}</a>`;
          content += '&nbsp;&nbsp;&nbsp;';
        } else {
          buttonContent = `<button class="buttons button-${iconName}" id="${iconName}" title="${iconName}">${iconFont}</button>`;
        }


        if (index % 3 === 0 && index !== 0) {
          content += '&nbsp;&nbsp;&nbsp;&nbsp';
        }
        content += buttonContent;
      }
    });
    content += '<div>';
    docFrag.innerHTML = content;
    return docFrag;
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

    const snipTextStyles = {
      outline: 'none',
      border: textareaBorder,
      borderTop: 'none',
      borderRadius: `0 0 ${radius} ${radius}`,
      boxSizing: 'border-box',
    };

    const buttonContainer = document.querySelector('.snipText-button-container');
    Object.assign(buttonContainer.style, buttonContainerStyles);

    const snipTextContainer = document.querySelector('.snipTextBody');
    Object.assign(snipTextContainer.style, snipTextStyles);

    const snipTextBody = document.querySelector('.snipTextBody');
    Object.assign(snipTextBody.style, defaultFrameStyles);

    const tabNavBtn = document.querySelector('.snipText-tabnav-tabs .tabnav');
    Object.assign(tabNavBtn.style, navTabs);

    const allButtons = document.querySelectorAll('.buttons');
    allButtons.forEach((button) => {
      Object.assign(button.style, buttonStyles);
    });
  };

  const expandHeight = (value, textAreaHeight) => {
    const numberOfLineBreaks = (value.match(/\n/g) || []).length;
    const newHeight = textAreaHeight + (numberOfLineBreaks) * 20 + 15;
    return newHeight;
  };


  return {
    extendDefaults,
    concatClassName,
    displayButtons,
    containerStyles,
    expandHeight,
  };
})();

export default Utils;