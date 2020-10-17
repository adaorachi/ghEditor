import { expandHeight } from './computedProps';
import { setStorageInterval } from './saveInterval';
import { autoUpdatePreviewInput } from '../textArea/updateEditorArea';
import indentTab from '../indentWithTab';

const useEvents = (textarea, editorId, prop) => {
  let savedInterval = null;
  const textAreaHeight = textarea.style.height;
  textarea.addEventListener('input', (e) => {
    autoUpdatePreviewInput(editorId, prop);

    textarea.style.height = `${expandHeight(textarea, textAreaHeight)}px`;
    const toolbarButtonArea = document.querySelector(`.toolbar-button-area-${editorId}`);
    const toolbarTooltip = document.querySelector(`.toolbar-tooltip-${editorId}`);
    toolbarButtonArea.classList.remove('dropdown');
    if (toolbarTooltip !== null) {
      toolbarTooltip.classList.remove('dropdown');
    }

    indentTab(e, textarea, prop);
  });

  textarea.addEventListener('focus', () => {
    savedInterval = setStorageInterval(editorId, prop);
  });

  textarea.addEventListener('blur', () => {
    clearInterval(savedInterval);
  });

  document.addEventListener('click', (e) => {
    const aa = [`toolbar-button-area-${editorId}`, `filter-emoji-area-${editorId}`, `toolbar-tooltip-${editorId}`];
    aa.forEach((area) => {
      const a = document.querySelector(`.${area}`);
      if (!e.target.classList.contains(area) && a !== null) {
        a.classList.remove('dropdown');
      }
    });
  });
};

export default useEvents;