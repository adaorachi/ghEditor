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

const displayCommandButtons = (editorId, mainButtons, size = 16, toolSuggester = false) => {
  let content = '';
  const buttonTitleText = {
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
  };
  mainButtons.split('|').forEach((button, index) => {
    const iconName = button.trim();
    const isIcon = octicon[iconName].toSVG({ width: size, height: size });
    let addClass;
    let limiter;
    if (toolSuggester) {
      addClass = '-suggester';
      limiter = '<span>|</span>';
    } else {
      addClass = '';
      limiter = '&nbsp;&nbsp;&nbsp;&nbsp';
    }
    const buttonId = `${iconName}-${editorId}${addClass}`;

    if (isIcon !== undefined) {
      if (index % 3 === 0 && index !== 0) {
        content += limiter;
      }
      const className = `markdown-button-${editorId}${addClass} button-${iconName}`;
      content += `<button type="button" class="tooltip-${editorId} buttons ${className}" id="${buttonId}" aria-label="${buttonTitleText[iconName]}">${isIcon}</button>`;
    }
  });

  return content;
};

const displayUtilButtons = (properties, editorId) => {
  let smiley = '';
  let help = '';
  let wordCount = '';
  if (extendDefaults(properties).buttonEmoji) {
    const isIcon = octicon.smiley.toSVG();
    const className = `snip-emoji-button-${editorId} snip-emoji-button`;
    smiley += `<button type="button" class="tooltip-${editorId} buttons ${className}" id="smiley-${editorId}" aria-label="Insert an emoji">${isIcon}</button>`;
    smiley += '&nbsp;&nbsp;&nbsp;';
  }

  help += '&nbsp;&nbsp;&nbsp;';
  const isIcon = octicon.question.toSVG();
  const anc = `<a href="https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet" target="_blank">${isIcon}</a>`;
  help += `<button type="button" class="tooltip-${editorId} buttons snip-help" id="help-${editorId}" aria-label="Help?">${anc}</button>`;

  wordCount += `<div class="snip-word-count snip-word-count-${editorId} remove"></div>`;

  return [smiley, help, wordCount];
};

const displayButtons = (properties) => {
  const editorId = extendDefaults(properties).id;
  const docFrag = document.querySelector(`.snip-text-header-${editorId}`);

  let content = '';
  content += headerTabs(editorId);

  content
    += `<div class="snip-text-header-content snip-text-header-content-${editorId}">
      <div class="snip-text-button-container snip-text-button-container-${editorId}">`;

  content += displayUtilButtons(properties, editorId)[0];
  const mainButtons = extendDefaults(properties).buttons;
  content += displayCommandButtons(editorId, mainButtons);
  content += displayUtilButtons(properties, editorId)[1];

  content += '</div>';
  content += displayUtilButtons(properties, editorId)[2];
  content += '</div>';

  docFrag.innerHTML = content;
  return docFrag;
};

export { displayButtons, displayCommandButtons };