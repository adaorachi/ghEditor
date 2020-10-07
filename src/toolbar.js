import { extendDefaults } from './utils';

const headerTabs = (editorId) => {
  const content = `<div class="snip-text-tabnav-tabs-${editorId} snip-text-tabnav-tabs" id="snip-text-tabnav-tabs-${editorId}">
        <div class="snip-text-tabnav-buttons snip-text-tabnav-buttons-${editorId}" id="snip-text-tabnav-buttons-${editorId}">
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

      const chevronOne = document.getElementById(`chevron-up-${editorId}`);
      const chevronTwo = document.getElementById(`chevron-down-${editorId}`);

      chevronOne.style.display = (
        chevronOne.style.display === 'none' ? 'inline' : 'none');
      chevronTwo.style.display = (
        chevronTwo.style.display === 'none' ? 'inline' : 'none');
    });
  }
};

const toggleToolbarButton = (editorId, toggleButtonLength) => {
  let noLength = '';
  if (toggleButtonLength === 0) {
    noLength = 'display-none';
  }
  const toggleT = `<button type="button" class="buttons toggle-toolbar-button toggle-toolbar-${editorId} display ${noLength}">
      <img src="https://adaorachi.github.io/snipdown_emojis/toolbar/typography.svg" />
      <img src="https://adaorachi.github.io/snipdown_emojis/toolbar/chevron-up.svg" id="chevron-up-${editorId}" />
      <img src="https://adaorachi.github.io/snipdown_emojis/toolbar/chevron-down.svg" style="display:none;" id="chevron-down-${editorId}" />
    </button>`;
  return toggleT;
};

const commandButtons = (mainButtons2, editorId, addClass, prop, suggestBtn, limiter) => {
  // eslint-disable-next-line one-var
  let div1 = '',
    allDiv = '',
    content1 = '',
    content2 = '',
    countAllToggled = 0,
    allToggledBtn = '';

  const buttonIconNames = ['smiley', 'split-screen', 'heading', 'bold', 'italic', 'strikethrough', 'blockquote', 'code', 'link', 'code-block', 'unordered-list', 'ordered-list', 'tasklist', 'horizontal-rule', 'mention', 'table', 'image', 'guide'];
  const toggleButtons = ['heading', 'bold', 'italic', 'unordered-list', 'ordered-list', 'tasklist'];

  buttonIconNames.forEach((button) => {
    if (mainButtons2.map(s => s.trim()).includes(button)) {
      const iconName = button.trim();
      let isIcon = `<img class="snipdown-toolbar-buttons" src="https://adaorachi.github.io/snipdown_emojis/toolbar/${iconName}${suggestBtn}.svg" />`;

      const buttonId = `${iconName}-${editorId}${addClass}`;
      let className;

      if (button === 'smiley') {
        className = `snip-emoji-button-${editorId} snip-emoji-button`;
      } else if (button === 'split-screen') {
        className = `snip-preview-button-${editorId} snip-preview-button`;
      } else if (button === 'guide') {
        className = 'snip-help';
        const isIconGuide = isIcon;
        isIcon = `<a href="https://github.com/adaorachi/SnipDown/wiki/Markdown_cheat_sheet" target="_blank">${isIconGuide}</a>`;
      } else {
        className = `markdown-button-${editorId}${addClass} button-${iconName}`;
      }

      let tooltipClass = '';
      if (extendDefaults(prop).toolTip.enabled) {
        tooltipClass = 'tooltip-button';
      }

      const buttonToolTip = extendDefaults(prop).toolTip.toolTipText;

      let toggleBtn = '';
      if (toggleButtons.includes(iconName)) {
        countAllToggled += 1;
        toggleBtn = 'toggle-btn';
        allToggledBtn += `<span class="limiter">|</span><button type="button" class="${tooltipClass} tooltip-${editorId} buttons ${className}" id="${buttonId}" aria-label="${buttonToolTip[iconName]}">${isIcon}</button>`;
      }

      const button1 = `<button type="button" class="${tooltipClass} tooltip-${editorId} ${toggleBtn} buttons ${className}" id="${buttonId}" aria-label="${buttonToolTip[iconName]}">${isIcon}</button>${limiter}`;

      allDiv += button1;
    }
  });

  div1 = `<div class="button-container-toggle button-container-toggle-${editorId} display" id="button-container-toggle-${editorId}">${allToggledBtn}</div>`;
  content1 = `${div1}`;
  content2 = `${allDiv}`;

  return [content1, content2, countAllToggled];
};

const displayCommandButtons = (editorId, prop, mainButtons, toolSuggester = false) => {
  // eslint-disable-next-line one-var
  let content = '',
    addClass,
    mainButtons2,
    limiter,
    suggestBtn;

  if (toolSuggester) {
    addClass = '-suggester';
    suggestBtn = 'White';
    limiter = '';
    mainButtons2 = mainButtons.split('|').slice(0, 6);
  } else {
    addClass = '';
    limiter = '<span class="limiter">|</span>';
    suggestBtn = '';
    mainButtons2 = `smiley|split-screen|${mainButtons}|guide`.split('|');
  }

  // eslint-disable-next-line prefer-destructuring
  content = commandButtons(mainButtons2, editorId, addClass, prop, suggestBtn, limiter);
  return content;
};

const displayUtilButtons = (editorId) => {
  const wordCount = `<div class="snip-word-count snip-word-count-${editorId} remove" id="snip-word-count-${editorId}"></div>`;
  return wordCount;
};

const displayButtons = (properties) => {
  const editorId = extendDefaults(properties).container;
  const docFrag = document.querySelector(`.snip-text-header-${editorId}`);

  const mainButtons = extendDefaults(properties).headerToolbar.icons;
  const displayCmdBtns = displayCommandButtons(editorId, properties, mainButtons);

  let content = '';
  content += headerTabs(editorId);
  content
    += `<div class="snip-text-header-content snip-text-header-content-${editorId}" id="snip-text-header-content-${editorId}">`;

  content += `<div class="snip-text-button-container remove snip-text-button-container-${editorId}">`;

  content += `
  <div class="button-container-untoggle button-container-untoggle-${editorId}">${toggleToolbarButton(editorId, displayCmdBtns[2])}${displayCmdBtns[1]}</div>`;

  content += displayCommandButtons(editorId, properties, mainButtons)[0];
  content += '</div>';
  content += displayUtilButtons(editorId);
  content += '</div>';

  docFrag.innerHTML = content;

  if (extendDefaults(properties).hideToolBar) {
    document.querySelector(`.snip-text-header-${editorId}`).classList.add('hide');
  }
};

const toggleToolbarOnResize = (editorId) => {
  const allContainer = document.querySelector(`.snip-write-${editorId}`).getBoundingClientRect().width;
  const header = [`.snip-text-header-content-${editorId}`, `.snip-text-header-${editorId}`];
  const toggleCon = [`.button-container-toggle-${editorId}`, `.toggle-toolbar-${editorId}`];
  const toggleButtons = document.querySelectorAll('.buttons.toggle-btn');
  const toggleLimiters = document.querySelectorAll('.limiter.toggle-btn');

  if (allContainer <= 690) {
    header.forEach(item => {
      document.querySelector(item).classList.add('toggle');
    });
  } else {
    header.forEach(item => {
      document.querySelector(item).classList.remove('toggle');
    });
  }

  if (allContainer <= 550) {
    Array.from(toggleButtons).concat(Array.from(toggleLimiters)).forEach(but => {
      but.classList.add('toggle');
    });
    toggleCon.forEach(item => {
      document.querySelector(item).classList.remove('display');
    });
  } else {
    Array.from(toggleButtons).concat(Array.from(toggleLimiters)).forEach(but => {
      but.classList.remove('toggle');
    });
    toggleCon.forEach(item => {
      document.querySelector(item).classList.add('display');
    });
  }
};

export {
  displayButtons,
  displayCommandButtons,
  toggleToolbar,
  toggleToolbarOnResize,
};