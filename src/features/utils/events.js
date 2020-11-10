import { expandHeight } from './computedProps';
import { setStorageInterval } from './saveInterval';
import { autoUpdatePreviewInput } from '../textArea/updateEditorArea';
import { nothingToPreviewDisplay } from '../../helpers/helpers';

// eslint-disable-next-line max-len
const expandAllContainers = (textarea, textAreaHeight, textpreview, textBodyHeight, footer, prop) => {
  textarea.style.height = `${expandHeight(textarea, textAreaHeight)}px`;
  textarea.style.minHeight = prop.minHeight;
  textarea.style.maxHeight = prop.maxHeight;
  textpreview.style.height = `${textarea.clientHeight}px`;
  textBodyHeight.style.height = `${textarea.clientHeight + footer + 12 - 1}px`;
};

const useEvents = (textarea, editorId, prop) => {
  let savedInterval = null;

  const textBodyHeight = document.querySelector(`.gheditor-writearea-${editorId}`);
  const textpreview = document.getElementById(`gheditor-preview-${editorId}`);

  const textAreaHeight = textarea.style.height;

  textarea.addEventListener('input', () => {
    const footer = document.querySelector(`.gheditor-footer-${editorId}`).clientHeight;

    autoUpdatePreviewInput(editorId, prop);

    expandAllContainers(textarea, textAreaHeight, textpreview, textBodyHeight, footer, prop);
    nothingToPreviewDisplay(editorId);

    const toolbarButtonArea = document.querySelector(`.toolbar-button-area-${editorId}`);
    const toolbarTooltip = document.querySelector(`.toolbar-tooltip-${editorId}`);
    toolbarButtonArea.classList.remove('dropdown');
    if (toolbarTooltip !== null) {
      toolbarTooltip.classList.remove('dropdown');
    }
  });

  textarea.addEventListener('focus', () => {
    const footer = document.querySelector(`.gheditor-footer-${editorId}`).clientHeight;

    savedInterval = setStorageInterval(editorId, prop);
    const body = document.getElementById(`gheditor-text-body-${editorId}`);
    if (![...body.classList].includes('preview')) {
      expandAllContainers(textarea, textAreaHeight, textpreview, textBodyHeight, footer, prop);
    }
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