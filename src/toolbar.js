import octicon from '@primer/octicons';
import { extendDefaults } from './utils';

const headerTabs = (editorId) => {
  const content = `<div class="snip-text-tabnav-tabs-${editorId} snip-text-tabnav-tabs" id="snip-text-tabnav-tabs-${editorId}">
        <div class="snip-text-tabnav-buttons snip-text-tabnav-buttons-${editorId}">
          <button type="button" class="btn-nav btn-nav-${editorId} tabnav write-tab-nav active" id="snip-write-tab-${editorId}" role="tab">Write</button>
          <button type="button" class="btn-nav btn-nav-${editorId} tabnav preview-tab-nav" id="snip-preview-tab-${editorId}" role="tab">Preview</button>
        </div>
      </div>`;
  return content;
};

const toggleToolbarButton = (editorId) => {
  const octIcon = octicon['triangle-down'];
  const isIcon = octIcon.toSVG({ width: 24, height: 24 });
  const toggleT = `<button type="button" class="buttons toggle-toolbar-button toggle-toolbar-${editorId}">${isIcon}</button>`;
  return toggleT;
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

const displayCommandButtons = (editorId, mainButtons, size = 16, toolSuggester = false) => {
  // eslint-disable-next-line one-var
  let content = '',
    div1 = '',
    div2 = '',
    addClass,
    limiter,
    mainButtons2;

  const buttonTitleText = {
    smiley: 'Insert an emoji',
    heading: 'Add header text',
    bold: 'Add bold text',
    italic: 'Add italic text',
    quote: 'Insert a quote',
    code: 'Insert code',
    link: 'Add a link',
    'code-square': 'Insert code block',
    'list-unordered': 'Add a bulleted list',
    'list-ordered': 'Add a numbered list',
    tasklist: 'Add a tasklist',
    mention: 'Directly mention a Github user',
    question: 'Help?',
  };

  if (toolSuggester) {
    addClass = '-suggester';
    limiter = '<span>|</span>';
    mainButtons2 = mainButtons.split('|');
  } else {
    addClass = '';
    limiter = '&nbsp;&nbsp;&nbsp';
    mainButtons2 = `smiley|${mainButtons}|question`.split('|');
  }

  mainButtons2.forEach((button, index) => {
    const iconName = button.trim();
    const octIcon = octicon[iconName];

    const buttonId = `${iconName}-${editorId}${addClass}`;

    if (octIcon !== undefined) {
      const isIcon = octIcon.toSVG({ width: size, height: size });
      let className;
      let isIcon1 = isIcon;

      if (button === 'smiley') {
        className = `snip-emoji-button-${editorId} snip-emoji-button`;
      } else if (button === 'question') {
        className = 'snip-help';
        isIcon1 = `<a href="https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet" target="_blank">${isIcon}</a>`;
      } else {
        className = `markdown-button-${editorId}${addClass} button-${iconName}`;
      }

      let limit = '';
      if ((index - 1) % 3 === 0 || index === (mainButtons2.length - 1)) {
        limit += limiter;
      }

      const button1 = `${limit}<button type="button" class="tooltip-${editorId} buttons ${className}" id="${buttonId}" aria-label="${buttonTitleText[iconName]}">${isIcon1}</button>`;

      if (index === 7) {
        div1 += toggleToolbarButton(editorId);
      }
      if (index <= 6) {
        div1 += button1;
      } else {
        div2 += button1;
      }
    }
  });

  div1 = `<div class="button-container-untoggle button-container-untoggle-${editorId}">${div1}</div>`;
  div2 = `<div class="button-container-toggle button-container-toggle-${editorId}">${div2}</div>`;
  content = `${div1}${div2}`;
  return content;
};

const displayUtilButtons = (editorId) => {
  let wordCount = '';
  wordCount += `<div class="snip-word-count snip-word-count-${editorId} remove"></div>`;
  return wordCount;
};

const displayButtons = (properties) => {
  const editorId = extendDefaults(properties).id;
  const docFrag = document.querySelector(`.snip-text-header-${editorId}`);

  let content = '';
  content += headerTabs(editorId);
  content
    += `<div class="snip-text-header-content snip-text-header-content-${editorId}">
      <div class="snip-text-button-container snip-text-button-container-${editorId}">`;

  const mainButtons = extendDefaults(properties).buttons;
  content += displayCommandButtons(editorId, mainButtons);

  content += '</div>';
  content += displayUtilButtons(editorId);
  content += '</div>';

  docFrag.innerHTML = content;
  return docFrag;
};

export { displayButtons, displayCommandButtons, toggleToolbar };