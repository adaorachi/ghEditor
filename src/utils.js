import { library, icon } from '@fortawesome/fontawesome-svg-core';
import {
  faBold, faUnderline, faItalic,
  faStrikethrough, faHeading, faQuoteLeft,
  faCode, faLink, faListUl,
  faListOl, faCheckSquare, faQuestionCircle,
  faSmileBeam,
} from '@fortawesome/free-solid-svg-icons';
import Emojis from './emojis';

library.add(
  faBold, faUnderline, faItalic,
  faStrikethrough, faHeading, faQuoteLeft,
  faCode, faLink, faListUl,
  faListOl, faCheckSquare, faQuestionCircle,
  faSmileBeam,
);

const Utils = (() => {
  const extendDefaults = (properties) => {
    const defaults = {
      className: 'fade-and-drop',
      emoji: true,
      width: '100%',
      height: '100px',
      buttons: 'underline|bold|italic',
      // buttonBgColor: 'red',
      // borderColor: '#000',
      // buttonColor: '#ff00ff',
      frameStyles: {
        // border: '1px solid #ced4da',
        // borderRadius: '0.25rem',
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

  const embedIcon = (iconName, tag, className) => {
    let content = '';
    let isIcon = icon({ prefix: 'fas', iconName });
    isIcon = isIcon.html;
    if (isIcon !== undefined) {
      if (tag === 'anchor') {
        content += `<a href="https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet" class="${className}" target="_blank" title="help">${isIcon}</a>`;
      } else if (tag === 'button') {
        content += `<button type="button" class="buttons ${className}">${isIcon}</button>`;
      }
    }
    return content;
  };

  const displayButtons = (properties) => {
    const docFrag = document.querySelector('.snip-text-header');

    let content = '';
    content += `<div class="snip-text-tabnav-tabs" id="snip-text-tabnav-tabs">
                  <button type="button" class="btn-nav tabnav write-tab-nav active" id="snip-write-tab" role="tab">Write</button>
                  <button type="button" class="btn-nav tabnav preview-tab-nav" id="snip-preview-tab" role="tab">Preview</button>
                </div>`;

    const mainButtons = extendDefaults(properties).buttons;
    content += '<div class="snipText-button-container">';

    content += embedIcon('smile-beam', 'button', 'snip-emoji-button');
    content += '&nbsp;&nbsp;&nbsp;';

    mainButtons.split('|').forEach((button, index) => {
      const iconName = button.trim();

      if (index % 3 === 0 && index !== 0) {
        content += '&nbsp;&nbsp;&nbsp;&nbsp';
      }
      content += embedIcon(iconName, 'button', `markdown-button button-${iconName}" id="${iconName}`);
    });

    content += '&nbsp;&nbsp;&nbsp;';
    content += embedIcon('question-circle', 'anchor', '');

    content += '</div>';
    docFrag.innerHTML = content;
    return docFrag;
  };

  const toggleEmojiArea = () => {
    const emojiBut = document.querySelector('.snip-emoji-button');

    const emojiArea = document.createElement('div');
    emojiArea.className = 'snip-emoji-area';
    emojiBut.append(emojiArea);

    const emojis = Emojis();
    emojiArea.innerHTML = emojis.getEmojiIcons();

    emojiBut.addEventListener('click', () => {
      emojiArea.classList.toggle('show-emoji');
    });
  };

  const containerStyles = (properties) => {
    const textArea = document.querySelector('textarea#snip-write');
    const options = extendDefaults(properties);
    const computedStyles = getComputedStyle(textArea);

    // const frameBorderColor = options.frameStyles.border;
    // const textareaBorder = frameBorderColor || computedStyles.border;

    const computedFrameStyles = {
      // fontSize: computedStyles.fontSize,
      // fontWeight: computedStyles.fontWeight,
      // lineHeight: computedStyles.lineHeight,
      color: computedStyles.color,
      fontFamily: computedStyles.fontFamily,
      margin: computedStyles.margin,
    };

    const defaultFrameStyles = { ...computedFrameStyles, ...options.frameStyles };
    // delete defaultFrameStyles.border;
    // delete defaultFrameStyles.borderRadius;

    const snipTextBody = document.querySelector('.snip-text-mark-down .snip-text-body');
    Object.assign(snipTextBody.style, defaultFrameStyles);

    // eslint-disable-next-line no-prototype-builtins
    if (options.hasOwnProperty('buttonBgColor')) {
      const buttonContainer = document.querySelector('.snip-text-header');
      buttonContainer.style.backgroundColor = options.buttonBgColor;
    }

    if (options.hasOwnProperty('borderColor')) {
      const buttonContainer = document.querySelector('.snip-text-header');
      const bodyContainer = document.querySelector('.snip-text-body');
      const activeTabNav = document.querySelector('.btn-nav.tabnav.active');

      buttonContainer.style.border = `1px solid ${options.borderColor}`;
      buttonContainer.style.borderBottom = 'none';
      activeTabNav.style.border = `1px solid ${options.borderColor}`;
      activeTabNav.style.borderBottom = 'none';
      bodyContainer.style.border = `1px solid ${options.borderColor}`;

      const tabNav = document.querySelectorAll('.btn-nav.tabnav');
      tabNav.forEach((nav) => {
        nav.style.border = `1px solid ${options.buttonBgColor}`;
      });
    }

    // eslint-disable-next-line no-prototype-builtins
    if (options.hasOwnProperty('buttonColor')) {
      const allButtons = document.querySelectorAll('.snip-text-mark-down .buttons');
      allButtons.forEach((button) => {
        button.style.color = options.buttonColor;
      });
    }
  };

  const expandHeight = (value, textAreaHeight) => {
    const numberOfLineBreaks = (value.match(/\n/g) || []).length;
    const newHeight = textAreaHeight + (numberOfLineBreaks) * 20 + 15;
    return newHeight;
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

  return {
    extendDefaults,
    concatClassName,
    displayButtons,
    containerStyles,
    expandHeight,
    toggleEmojiArea,
    setAttributeToEmojiSelected,
  };
})();

export default Utils;