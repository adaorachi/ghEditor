import extendDefaults from '../settings/customOptionSetting';
import { toggleMoreButton, headerContent } from './insertDomSnippet';

const appendToggleToolbarButton = (editorId, toggleButtonLength) => {
  let noLength = '';
  if (toggleButtonLength === 0) {
    noLength = 'display-none';
  }
  const toggleT = toggleMoreButton(editorId, noLength);
  return toggleT;
};

const iconNames = {
  headerToolbar: ['smiley', 'split-screen', 'heading', 'bold', 'italic', 'strikethrough', 'blockquote', 'code', 'link', 'code-block', 'unordered-list', 'ordered-list', 'tasklist', 'horizontal-rule', 'mention', 'table', 'image', 'guide'],
  inlineToolbar: ['heading', 'bold', 'italic', 'unordered-list', 'ordered-list', 'tasklist'],
};

const createToolbarBtns = (allButtons, editorId, addClass, prop, suggestBtn, limiter) => {
  let inlineContent = '';
  let headerContent = '';
  let countAllToggled = 0;
  let inlineBtns = '';
  iconNames.headerToolbar.forEach((button) => {
    if (allButtons.map(s => s.trim()).includes(button)) {
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
      if (prop.toolTip.enabled) {
        tooltipClass = 'tooltip-button';
      }

      const buttonToolTip = prop.toolTip.toolTipText;

      let toggleBtn = '';
      if (iconNames.inlineToolbar.includes(iconName)) {
        countAllToggled += 1;
        toggleBtn = 'toggle-btn';
        inlineBtns += `<span class="limiter">|</span><button type="button" class="${tooltipClass} tooltip-${editorId} buttons ${className}" id="${buttonId}" aria-label="${buttonToolTip[iconName]}">${isIcon}</button>`;
      }

      const button1 = `<button type="button" class="${tooltipClass} tooltip-${editorId} ${toggleBtn} buttons ${className}" id="${buttonId}" aria-label="${buttonToolTip[iconName]}">${isIcon}</button>${limiter}`;

      headerContent += button1;
    }
  });

  inlineContent = `<div class="button-container-toggle button-container-toggle-${editorId} display" id="button-container-toggle-${editorId}">${inlineBtns}</div>`;

  return [inlineContent, headerContent, countAllToggled];
};

const disbandToolbarBtnFeature = (editorId, prop, mainButtons, toolSuggester = false) => {
  let content = '';
  let addClass;
  let allButtons;
  let limiter;
  let suggestBtn;

  if (toolSuggester) {
    [addClass, suggestBtn, limiter, allButtons] = ['-suggester', 'White', '', mainButtons.split('|').slice(0, 6)];
  } else {
    [addClass, suggestBtn, limiter, allButtons] = ['', '', '<span class="limiter">|</span>', `smiley|split-screen|${mainButtons}|guide`.split('|')];
  }

  content = createToolbarBtns(allButtons, editorId, addClass, prop, suggestBtn, limiter);
  return content;
};

const appendHeaderToDOM = (properties) => {
  const editorId = extendDefaults(properties).container;
  const docFrag = document.querySelector(`.snip-text-header-${editorId}`);

  const mainButtons = extendDefaults(properties).headerToolbar.icons;
  const displayCmdBtns = disbandToolbarBtnFeature(editorId, properties, mainButtons);

  const args = {
    editorId,
    appendToggleToolbarButton,
    displayCmdBtns,
    properties,
    mainButtons,
    disbandToolbarBtnFeature,
  };

  const content = headerContent(args);

  docFrag.innerHTML = content;

  if (extendDefaults(properties).hideToolBar) {
    document.querySelector(`.snip-text-header-${editorId}`).classList.add('hide');
  }
};

const toggleToolbarOnResize = (editorId) => {
  const allContainer = document.querySelector(`.snip-write-${editorId}`).getBoundingClientRect().width;
  const header = [`.snip-text-header-content-${editorId}`, `.snip-text-header-${editorId}`];
  const toggleCon = [`.button-container-toggle-${editorId}`, `.toggle-toolbar-${editorId}`];
  const toggleButtons = document.querySelectorAll(`.buttons.toggle-btn.markdown-button-${editorId}`);
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
  appendHeaderToDOM,
  disbandToolbarBtnFeature,
  toggleToolbarOnResize,
};