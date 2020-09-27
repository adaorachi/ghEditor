import { extendDefaults } from './utils';
import toggle from './images/more.svg';

const headerTabs = (editorId, isToggled) => {
  const content = `<div class="snip-text-tabnav-tabs-${editorId} snip-text-tabnav-tabs ${isToggled}" id="snip-text-tabnav-tabs-${editorId}">
        <div class="snip-text-tabnav-buttons snip-text-tabnav-buttons-${editorId}">
          <button type="button" class="btn-nav btn-nav-${editorId} tabnav write-tab-nav active" id="snip-writearea-tab-${editorId}" role="tab">Write</button>
          <button type="button" class="btn-nav btn-nav-${editorId} tabnav preview-tab-nav" id="snip-preview-tab-${editorId}" role="tab">Preview</button>
        </div>
      </div>`;
  return content;
};

const toggleToolbar = (editorId) => {
  const toggle = document.querySelector(`.toggle-toolbar-${editorId}`);
  if (toggle !== null) {
    toggle.addEventListener('click', () => {
      const lowerToolbar = document.querySelector(`.button-container-toggle-${editorId}`);
      lowerToolbar.classList.toggle('open');
    });
  }
};

const toggleToolbarButton = (editorId) => {
  const toggleT = `<button type="button" class="buttons toggle-toolbar-button toggle-toolbar-${editorId}">${toggle}</button>`;
  return toggleT;
};

const importAll = (r) => {
  const svg = {};
  // eslint-disable-next-line array-callback-return
  r.keys().map((item) => { svg[item.replace('./', '')] = r(item); });
  return svg;
};

const bb = (mainButtons2, editorId, addClass, limiter, prop, no) => {
  // eslint-disable-next-line one-var
  let div1 = '',
    div2 = '',
    allDiv = '',
    content1 = '',
    content2 = '';

  const buttonIconNames = ['smiley', 'split-screen', 'heading', 'bold', 'italic', 'blockquote', 'strikethrough', 'horizontal-rule', 'code', 'link', 'code-block', 'unordered-list', 'ordered-list', 'tasklist', 'mention', 'table', 'image', 'guide'];

  mainButtons2.forEach((button, index) => {
    if (buttonIconNames.includes(button)) {
      const iconName = button.trim();
      const svg = importAll(require.context('./images', false, /\.(svg)$/));
      let isIcon = svg[`${iconName}.svg`];

      const buttonId = `${iconName}-${editorId}${addClass}`;
      let className;

      if (button === 'smiley') {
        className = `snip-emoji-button-${editorId} snip-emoji-button`;
      } else if (button === 'split-screen') {
        className = `snip-preview-button-${editorId} snip-preview-button`;
      } else if (button === 'guide') {
        className = 'snip-help';
        const isIconGuide = isIcon;
        isIcon = `<a href="https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet" target="_blank">${isIconGuide}</a>`;
      } else {
        className = `markdown-button-${editorId}${addClass} button-${iconName}`;
      }

      let limit = '';
      if ((index - 2) % 3 === 0 || index === (mainButtons2.length - 1)) {
        limit += limiter;
      }

      let tooltipClass = '';
      if (extendDefaults(prop).toolTip.enabled) {
        tooltipClass = 'tooltip-button';
      }

      const buttonToolTip = extendDefaults(prop).toolTip.toolTipText;
      const button1 = `${limit}<button type="button" class="${tooltipClass} tooltip-${editorId} buttons ${className}" id="${buttonId}" aria-label="${buttonToolTip[iconName]}">${isIcon}</button>`;

      allDiv += button1;

      if (index === no - 1) {
        div1 += toggleToolbarButton(editorId);
      }
      if (index < no - 1) {
        div1 += button1;
      } else {
        div2 += button1;
      }
    }
  });

  div1 = `<div class="button-container-untoggle button-container-untoggle-${editorId}" id="button-container-untoggle-${editorId}">${div1}</div>`;
  div2 = `<div class="button-container-toggle button-container-toggle-${editorId}" id="button-container-toggle-${editorId}">${div2}</div>`;
  content1 = `${div1}${div2}`;
  content2 = `${allDiv}`;

  return [content1, content2];
};

const displayCommandButtons = (editorId, prop, mainButtons, no, toolSuggester = false) => {
  // eslint-disable-next-line one-var
  let content = '',
    addClass,
    limiter,
    mainButtons2;

  if (toolSuggester) {
    addClass = '-suggester';
    limiter = '';
    mainButtons2 = mainButtons.split('|').slice(0, 6);
  } else {
    addClass = '';
    limiter = '<span class="limiter">|</span>';
    mainButtons2 = `smiley|split-screen|${mainButtons}|guide`.split('|');
  }

  // eslint-disable-next-line prefer-destructuring
  content = bb(mainButtons2, editorId, addClass, limiter, prop, no);
  return content;
};

const displayUtilButtons = (editorId, isToggled1) => {
  let text = document.getElementById(`snip-preview-${editorId}`);
  let snipWord = '';
  if (text !== null) {
    text = text.innerText.trim();
    const charactersLength = text.length;
    const wordSplit = text.replace(/\r?\n/g, ' ').split(' ');
    const wordLength = text === '' ? 0 : wordSplit.length;
    snipWord = `${charactersLength} characters ${wordLength} words`;
  }
  const wordCount = `<div class="snip-word-count snip-word-count-${editorId} ${isToggled1}" id="snip-word-count-${editorId}">${snipWord}</div>`;
  return wordCount;
};

const displayButtons = (properties, index, no) => {
  const editorId = extendDefaults(properties).container;
  const docFrag = document.querySelector(`.snip-text-header-${editorId}`);

  const header = document.querySelector(`.snip-text-body-${editorId}`);
  const toggled = header.getAttribute('aria-toggle');
  const isToggled = toggled === 'false' ? '' : 'preview';
  const isToggled1 = toggled === 'true' ? '' : 'remove';

  let content = '';
  content += headerTabs(editorId, isToggled);
  content
    += `<div class="snip-text-header-content snip-text-header-content-${editorId} ${isToggled}" id="snip-text-header-content-${editorId}">
      <div class="snip-text-button-container remove snip-text-button-container-${editorId}">`;

  const mainButtons = extendDefaults(properties).headerToolbar.icons;
  content += displayCommandButtons(editorId, properties, mainButtons, no)[index];

  content += '</div>';
  content += displayUtilButtons(editorId, isToggled1);
  content += '</div>';

  docFrag.innerHTML = content;

  if (extendDefaults(properties).hideToolBar) {
    document.querySelector(`.snip-text-header-${editorId}`).classList.add('hide');
  }

  // return 'docFrag';
};

const toggleToolbarOnResize = (editorId, options) => {
  const buttonContainer = document.querySelector(`.snip-text-header-content-${editorId}`);
  // const buttonContainer = document.querySelector(`.snip-text-button-container-${editorId}`);
  const buttonContainerWidth = buttonContainer.getBoundingClientRect().width - 140;
  const buttonWidth = parseInt(extendDefaults(options).headerToolbar.iconSize, 10) + 12;
  const buttonLength = document.querySelectorAll(`#snip-text-header-content-${editorId} .buttons`);
  const allButtonWidth = buttonWidth * 18;
  const diff = allButtonWidth - buttonContainerWidth;

  if (diff >= 0) {
    const diffNo = buttonLength.length - (Math.ceil(diff / buttonWidth));
    displayButtons(options, 0, diffNo);
  } else {
    displayButtons(options, 1, '');
  }

  document.querySelector(`.snip-text-button-container-${editorId}`).classList.remove('remove');
};

export {
  displayButtons,
  displayCommandButtons,
  toggleToolbar,
  toggleToolbarOnResize,
};