import octicon from '@primer/octicons';
import { toggleEmojiArea } from './emojis';

const octIcon = octicon.archive;
const isIcon = octIcon.toSVG({ width: 16, height: 16 });

const setIntervalTimers = [];

const extendDefaults = (properties) => {
  const defaults = {
    container: 'sniptext',
    autoSave: {
      enabled: false,
      delay: 10000,
    },
    autoUseFontAwesome: true,
    blockStyles: {
      bold: '**',
      italic: '_',
      'code-block': '```',
    },
    frameStyles: {
      fontSize: '1rem',
      // color: 'red',
      // padding: '0.375rem 0.75rem',
      // background: 'red',
    },
    headerColor: '#586069',
    headerToolbar: {
      icons: 'heading|bold|italic|blockquote|strikethrough|horizontal-rule|code|link|code-block|unordered-list|ordered-list|tasklist|mention|image|table|',
      iconSize: '16',
    },
    hideToolBar: false,
    highlightCode: true,
    indentWithTab: false,
    inlineEmoji: {
      enabled: true,
      emojiPrefix: ':',
    },
    inlineToolbar: 'heading|bold|italic|code|link|unordered-list',
    inlineShortcut: true,
    maxHeight: 'auto',
    minHeight: '100px',
    placeholder: 'Leave your comment',
    splitScreen: {
      enabled: true,
      shortcut: true,
    },
    toolbarEmoji: true,
    toolTip: {
      enabled: true,
      toolTipText: {
        smiley: 'Insert an emoji',
        'split-screen': 'Toggle Preview',
        heading: 'Add header text',
        bold: 'Add bold text',
        italic: 'Add italic text',
        blockquote: 'Insert a quote',
        strikethrough: 'Add a strikethrough text',
        'horizontal-rule': 'Add an horizontal rule',
        code: 'Insert code',
        link: 'Add a link',
        'code-block': 'Insert code block',
        'unordered-list': 'Add a bulleted list',
        'ordered-list': 'Add a numbered list',
        tasklist: 'Add a tasklist',
        mention: 'Directly mention a Github user',
        table: 'Insert a table',
        image: 'Add an image',
        guide: 'Help?',
      },
    },
    uploadImage: true,
    uploadImageConfig: {},
    width: '100%',
  };

  const concatframeStyle = (propKey, childObj) => {
    if (childObj !== undefined) {
      return { ...defaults[propKey][childObj], ...properties[propKey][childObj] };
    }
    return { ...defaults[propKey], ...properties[propKey] };
  };

  Object.keys(properties).forEach((property) => {
    const parentProps = ['frameStyles', 'autoSave', 'headerToolbar', 'blockStyles', 'inlineEmoji', 'toolTip'];

    // eslint-disable-next-line no-prototype-builtins
    if (defaults.hasOwnProperty(property)) {
      if (parentProps.includes(property)) {
        if (property === 'toolTip') {
          defaults[property].toolTipText = concatframeStyle(property, 'toolTipText');
          defaults[property].enabled = properties[property].enabled;
        } else {
          defaults[property] = concatframeStyle(property);
        }
      } else {
        defaults[property] = properties[property];
      }
    }
  });
  return defaults;
};

const containerStyles = (properties) => {
  const editorId = extendDefaults(properties).container;
  const textArea = document.querySelector(`textarea.${editorId}`);
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

  const snipTextBody = document.querySelector(`.snip-write-${options.container}`);
  Object.assign(snipTextBody.style, defaultFrameStyles);
  const snipPreviewBody = document.querySelector(`.snip-preview-${options.container}`);
  Object.assign(snipPreviewBody.style, defaultFrameStyles);

  // eslint-disable-next-line no-prototype-builtins
  if (options.hasOwnProperty('headerColor')) {
    const allButtons = document.querySelectorAll(`.snip-text-mark-down-${options.container} .buttons svg`);
    allButtons.forEach((button) => {
      button.style.fill = options.headerColor;
      button.style.width = options.headerToolbar.iconSize;
    });
    [`snip-writearea-tab-${editorId}`, `snip-preview-tab-${editorId}`].forEach(tab => {
      document.getElementById(tab).style.color = options.headerColor;
      document.getElementById(tab).style.fontFamily = defaultFrameStyles.fontFamily;
      document.querySelector(`.filter-emoji-area-${editorId}`).style.fontFamily = defaultFrameStyles.fontFamily;
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

const getCurrentTime = () => {
  const autoSaved = new Date();
  const autoSavedToLocal = autoSaved.toLocaleTimeString();
  return autoSavedToLocal;
  // ${isIcon}
};

const savedTimer = (editorId) => `
                <span class="auto-save-icon" id="auto-save-icon-${editorId}">${isIcon}</span>
                <div id="auto-saved-${editorId}" class="auto-saved">
                  <span id="timer-pre-${editorId}">Autosaved:</span>
                  <span class="saved-timer" id="saved-timer-${editorId}">${getCurrentTime()}</span>
                </div>`;

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

const setEditorTextToStore = (editorId, props, value) => {
  let allText;
  const textarea = document.getElementById(`snip-write-${editorId}`);
  if (extendDefaults(props).autoSave.enabled) {
    if (localStorage.getItem('snipText') === null) {
      allText = {};
      allText[editorId] = textarea.value;
      localStorage.setItem('snipText', JSON.stringify(allText));
    } else {
      const allText1 = JSON.parse(localStorage.getItem('snipText'));
      // eslint-disable-next-line no-prototype-builtins
      if (!(allText1.hasOwnProperty(editorId))) {
        allText1[editorId] = '';
        localStorage.setItem('snipText', JSON.stringify(allText1));
      }
      allText = allText1[editorId] === undefined ? '' : allText1[editorId];
      textarea.value = allText;
    }
    document.getElementById(`snip-autosave-${editorId}`).innerHTML = `${savedTimer(editorId)}`;
  } else {
    textarea.value = value;
    window.localStorage.removeItem('snipText');
  }
};

const autoSave = (editorId) => {
  const textEditorValue = document.getElementById(`snip-write-${editorId}`).value;
  let allText;
  if (textEditorValue !== '') {
    if (localStorage.getItem('snipText') === null) {
      allText = {};
    } else {
      allText = JSON.parse(localStorage.getItem('snipText'));
      document.getElementById(`saved-timer-${editorId}`).innerText = `${getCurrentTime()}`;
    }
    allText[editorId] = textEditorValue;
    localStorage.setItem('snipText', JSON.stringify(allText));
  }
};

const autoSaveOnClicked = (editorId, props) => {
  if (extendDefaults(props).autoSave.enabled) {
    const timer2 = document.getElementById(`auto-saved-${editorId}`);
    const autoSavedButton = document.getElementById(`auto-save-icon-${editorId}`);
    autoSavedButton.addEventListener('click', () => {
      autoSave(editorId);
      document.getElementById(`timer-pre-${editorId}`).innerText = 'Saved:';
      timer2.classList.add('scale');
      setTimeout(() => {
        document.getElementById(`timer-pre-${editorId}`).innerText = 'Autosaved:';
        timer2.classList.remove('scale');
      }, 200);
    });
  }
};

const setStorageInterval = (editorId, props) => {
  let timer = null;
  if (extendDefaults(props).autoSave.enabled) {
    timer = setInterval(() => {
      autoSave(editorId);
    }, extendDefaults(props).autoSave.delay);
    setIntervalTimers.push(timer);
  }
  return timer;
};

const stopStorageInterval = () => {
  setIntervalTimers.forEach(timer => {
    clearInterval(timer);
  });
};

const useFontAwesome = (options) => {
  function css(element, property) {
    return window.getComputedStyle(element, null).getPropertyValue(property);
  }
  if (extendDefaults(options).autoUseFontAwesome) {
    const span = document.createElement('span');
    span.className = 'fa';
    span.style.display = 'none';
    document.body.insertBefore(span, document.body.firstChild);
    if (!(css(span, 'font-family').includes('Font') && css(span, 'font-family').includes('Awesome'))) {
      let headHTML = document.head.innerHTML;
      headHTML += '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.1/css/all.min.css">';
      document.head.innerHTML = headHTML;
    }
    document.body.removeChild(span);
  }
};

const defaultOptionSnippet = (props, editorId, snipUploadImage) => {
  if (extendDefaults(props).uploadImage) {
    const uploadProgress = document.createElement('div');
    uploadProgress.id = `snip-upload-container-${editorId}`;
    uploadProgress.className = 'snip-upload-container';
    uploadProgress.innerHTML = `
      <input type="file"
      id="snip-uploadimage-${editorId}" class="snip-uploadimage-input" name="snip-uploadimage-${editorId}">
      <span id="upload-image-progress-${editorId}" class="upload-image-progress">Attach files by draggng and dropping or selecting them</span>`;
    snipUploadImage.append(uploadProgress);
  }

  if (extendDefaults(props).autoSave.enabled) {
    const autoSaveArea = document.createElement('div');
    autoSaveArea.id = `snip-autosave-${editorId}`;
    autoSaveArea.className = 'snip-autosave';
    snipUploadImage.append(autoSaveArea);
  }

  if (extendDefaults(props).toolbarEmoji) {
    toggleEmojiArea(editorId);
  }

  useFontAwesome(props);
};

const createDOMElement = (tag, className, ...args) => {
  const a = document.createElement(tag);
  a.className = className;
  if (args.length > 0) {
    // eslint-disable-next-line prefer-destructuring
    a.id = args[0];
    // eslint-disable-next-line prefer-destructuring
    a.placeholder = args[1];
    // eslint-disable-next-line prefer-destructuring
    a.style.height = args[2];
    // eslint-disable-next-line prefer-destructuring
    a.style.maxHeight = args[3];
  }
  return a;
};

const appendToDOM = (appender, ...args) => {
  args.forEach(arg => {
    appender.append(arg);
  });
};

export {
  extendDefaults,
  containerStyles,
  expandHeight,
  setAttributeToEmojiSelected,
  setEditorTextToStore,
  setStorageInterval,
  stopStorageInterval,
  autoSaveOnClicked,
  defaultOptionSnippet,
  createDOMElement,
  appendToDOM,
};