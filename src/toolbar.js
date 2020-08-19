import { extendDefaults } from './utils';

const headerTabs = (editorId) => {
  const content = `<div class="snip-text-tabnav-tabs-${editorId} snip-text-tabnav-tabs" id="snip-text-tabnav-tabs-${editorId}">
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

const importAll = (r) => {
  const svg = {};
  // eslint-disable-next-line array-callback-return
  r.keys().map((item) => { svg[item.replace('./', '')] = r(item); });
  return svg;
};

const displayCommandButtons = (editorId, prop, mainButtons, toolSuggester = false) => {
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

  const buttonIconNames = ['smiley', 'split-screen', 'heading', 'bold', 'italic', 'blockquote', 'strikethrough', 'horizontal-rule', 'code', 'link', 'code-block', 'unordered-list', 'ordered-list', 'tasklist', 'mention', 'table', 'image', 'guide'];

  mainButtons2.forEach((button, index) => {
    if (buttonIconNames.includes(button)) {
      const iconName = button.trim();
      const svg = importAll(require.context('../dist/images', false, /\.(svg)$/));
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

      content += button1;
    }
  });
  return content;
};

const displayUtilButtons = (editorId) => {
  let wordCount = '';
  wordCount += `<div class="snip-word-count snip-word-count-${editorId} remove" id="snip-word-count-${editorId}"></div>`;
  return wordCount;
};

const displayButtons = (properties) => {
  const editorId = extendDefaults(properties).container;
  const docFrag = document.querySelector(`.snip-text-header-${editorId}`);

  let content = '';
  content += headerTabs(editorId);
  content
    += `<div class="snip-text-header-content snip-text-header-content-${editorId}" id="snip-text-header-content-${editorId}">
      <div class="snip-text-button-container snip-text-button-container-${editorId}">`;

  const mainButtons = extendDefaults(properties).headerToolbar.icons;
  content += displayCommandButtons(editorId, properties, mainButtons);

  content += '</div>';
  content += displayUtilButtons(editorId);
  content += '</div>';

  docFrag.innerHTML = content;

  if (extendDefaults(properties).hideToolBar) {
    document.querySelector(`.snip-text-header-${editorId}`).classList.add('hide');
  }
  return docFrag;
};

export { displayButtons, displayCommandButtons, toggleToolbar };