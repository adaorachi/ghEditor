import { library, icon } from '@fortawesome/fontawesome-svg-core';
import {
  faBold, faUnderline, faItalic,
  faStrikethrough, faHeading, faQuoteLeft,
  faCode, faLink, faListUl,
  faListOl, faCheckSquare, faQuestionCircle,
  faSmileBeam,
} from '@fortawesome/free-solid-svg-icons';
import octicon from '@primer/octicons';
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
      inTextEmoji: true,
      buttonEmoji: true,
      width: '100%',
      height: '100px',
      // buttons: 'heading|bold|italic|underline|strikethrough|quote-left|code|link|list-ul|list-ol|check-square',
      buttons: 'heading|bold|italic|quote|code|link|list-unordered|list-ordered|tasklist|mention',
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

  const concatClassName = (textarea, editorId) => {
    const classNames = textarea.classList;
    let concatClassName = '';
    classNames.forEach((className) => {
      if (className !== `snip-write-${editorId}`) { concatClassName += `${className} `; }
    });
    return concatClassName.trim();
  };

  const embedIcon = (iconName, editorId, tag, className) => {
    let content = '';
    const isIcon = octicon[iconName].toSVG();
    const buttonId = `${iconName}-${editorId}`;
    const buttonTitleText = {
      smiley: 'Insert an emoji',
      heading: 'Add header text',
      bold: 'Add bold text',
      italic: 'Add italic text',
      quote: 'Insert a quote',
      code: 'Insert code',
      link: 'Add a link',
      'list-unordered': 'Add a bulleted list',
      'list-ordered': 'Add a numbered list',
      tasklist: 'Add a tasklist',
      mention: 'Directly mention a Github user',
      help: 'Help?',
    };
    if (isIcon !== undefined) {
      if (tag === 'anchor') {
        const anc = `<a href="https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet" target="_blank">${isIcon}</a>`;
        content += `<button type="button" class="tooltip-${editorId} buttons ${className}" id="${buttonId}" aria-label="${buttonTitleText.help}">${anc}</button>`;
      } else if (tag === 'button') {
        content += `<button type="button" class="tooltip-${editorId} buttons ${className}" id="${buttonId}" aria-label="${buttonTitleText[iconName]}">${isIcon}</button>`;
      }
    }
    return content;
  };

  const displayButtons = (properties) => {
    const editorId = extendDefaults(properties).id;
    const docFrag = document.querySelector(`.snip-text-header-${editorId}`);

    let content = '';
    content
      += `<div class="snip-text-tabnav-tabs-${editorId} snip-text-tabnav-tabs" id="snip-text-tabnav-tabs-${editorId}">
        <div class="snip-text-tabnav-buttons snip-text-tabnav-buttons-${editorId}">
          <button type="button" class="btn-nav btn-nav-${editorId} tabnav write-tab-nav active" id="snip-write-tab-${editorId}" role="tab">Write</button>
          <button type="button" class="btn-nav btn-nav-${editorId} tabnav preview-tab-nav" id="snip-preview-tab-${editorId}" role="tab">Preview</button>
        </div>
      </div>`;

    const mainButtons = extendDefaults(properties).buttons;
    content
      += `<div class="snip-text-header-content snip-text-header-content-${editorId}">
      <div class="snip-text-button-container snip-text-button-container-${editorId}">`;

    if (extendDefaults(properties).buttonEmoji) {
      content += embedIcon('smiley', editorId, 'button', `snip-emoji-button-${editorId} snip-emoji-button`);
    }

    content += '&nbsp;&nbsp;&nbsp;';

    mainButtons.split('|').forEach((button, index) => {
      const iconName = button.trim();


      if (index % 3 === 0 && index !== 0) {
        content += '&nbsp;&nbsp;&nbsp;&nbsp';
      }

      // const icon = octicon[iconName].toSVG();

      // const aa = document.getElementById('gistme')
      // aa.innerHTML = alert;
      // aa.style.fill = 'red'
      content += embedIcon(iconName, editorId, 'button', `markdown-button-${editorId} button-${iconName}`);

      // content += embedIcon(iconName, 'button', `markdown-button-${editorId} button-${iconName}" id="${iconName}`);
    });

    content += '&nbsp;&nbsp;&nbsp;';
    content += embedIcon('question', editorId, 'anchor', 'snip-help');

    content += '</div>';
    content += `<div class="snip-word-count snip-word-count-${editorId} remove"></div>`;

    content += '</div>';
    docFrag.innerHTML = content;
    return docFrag;
  };

  const toggleEmojiArea = (properties) => {
    const editorId = extendDefaults(properties).id;
    const emojiBut = document.querySelector(`.snip-emoji-button-${editorId}`);

    const emojiArea = document.createElement('div');
    emojiArea.className = `snip-emoji-area snip-emoji-area-${editorId}`;
    emojiBut.append(emojiArea);

    const emojis = Emojis();
    emojiArea.innerHTML = emojis.getEmojiIcons(editorId);

    emojiBut.addEventListener('click', () => {
      emojiArea.classList.toggle('show-emoji');
    });
  };

  const containerStyles = (properties, editorId) => {
    const textArea = document.querySelector(`textarea#snip-write-${editorId}`);
    const options = extendDefaults(properties);
    const computedStyles = getComputedStyle(textArea);

    const computedFrameStyles = {
      fontSize: computedStyles.fontSize,
      color: computedStyles.color,
      fontFamily: computedStyles.fontFamily,
      margin: computedStyles.margin,
    };

    const defaultFrameStyles = { ...computedFrameStyles, ...options.frameStyles };

    const snipTextBody = document.querySelector(`.snip-write-${options.id}`);
    Object.assign(snipTextBody.style, defaultFrameStyles);
    const snipPreviewBody = document.querySelector(`.snip-preview-${options.id}`);
    Object.assign(snipPreviewBody.style, defaultFrameStyles);

    // eslint-disable-next-line no-prototype-builtins
    if (options.hasOwnProperty('buttonColor')) {
      const allButtons = document.querySelectorAll(`.snip-text-mark-down-${options.id} .buttons`);
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