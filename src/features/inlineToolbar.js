/* eslint-disable max-len */
/* eslint-disable prefer-destructuring */
import placeAreasByCoord from './utils/placeDropdownByCoords';
import execCmd from './buttonCommand/execCmd';
import { disbandToolbarBtnFeature } from '../dom/appendHeaderToDOM';
import inlineShortcut from './inlineShortcut';
import indentTab from './indentWithTab';

let isSelected = false;
const inlineToolbar = (prop, editorId, textarea) => {
  const toolbarButtonArea = document.querySelector(`.toolbar-button-area-${editorId}`);
  const suggestorButtons = prop.inlineToolbar;
  const toolbarTooltip = document.createElement('span');
  toolbarTooltip.className = `toolbar-tooltip toolbar-tooltip-${editorId}`;

  if (suggestorButtons !== '') {
    textarea.addEventListener('select', () => {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selected = textarea.value.slice(start, end).length;
      if (selected > 0) {
        placeAreasByCoord(`.toolbar-button-area-${editorId}`, textarea, editorId, toolbarButtonArea, toolbarTooltip, false);

        toolbarButtonArea.classList.add('dropdown');
        toolbarTooltip.classList.add('dropdown');

        toolbarButtonArea.innerHTML = disbandToolbarBtnFeature(editorId, prop, suggestorButtons, true)[1];

        execCmd(textarea, `.buttons.markdown-button-${editorId}-suggester`, editorId, prop);

        isSelected = true;
      }
      document.querySelector(`.filter-emoji-area-${editorId}`).classList.remove('dropdown');
    });
  } else {
    toolbarButtonArea.style.display = 'none';
    toolbarTooltip.style.display = 'none';
  }
};

const execInlineShortcut = (textarea, prop) => {
  textarea.addEventListener('keydown', (e) => {
    indentTab(e, textarea, prop);
    if (isSelected) {
      inlineShortcut(e, prop, textarea);
    }
  });
};

export { inlineToolbar, execInlineShortcut };
