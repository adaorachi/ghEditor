import extendDefaults from '../../settings/customOptionSetting';
import { expandHeight } from '../utils/computedProps';
import getMarkdown from '../getMarkdown';
import { displayWordCount } from '../../helpers/helpers';

const updatePreviewInputOnClick = (editorId, prop) => {
  const previewButtons = [`#snip-preview-tab-${editorId}`, `.snip-preview-button-${editorId}`];
  previewButtons.forEach(button => {
    document.querySelector(button).addEventListener('click', () => {
      const text = getMarkdown(editorId, prop);
      document.getElementById(`snip-preview-${editorId}`).innerHTML = text;
    });
  });
};

const autoUpdatePreviewInput = (editorId, prop) => {
  const textarea = document.getElementById(`snip-write-${editorId}`);
  const textAreaHeight = textarea.style.height;
  if (extendDefaults(prop).splitScreen.enabled) {
    const text = getMarkdown(editorId, prop);
    const previewArea = document.getElementById(`snip-preview-${editorId}`);
    previewArea.innerHTML = text;
    previewArea.style.height = `${expandHeight(textarea, textAreaHeight)}px`;
    displayWordCount(editorId);
  }
};

const insertWriteInput = (matchEmoji, editorId, prop) => {
  const textarea = document.getElementById(`snip-write-${editorId}`);
  textarea.value = matchEmoji;
  autoUpdatePreviewInput(editorId, prop);
};

export { updatePreviewInputOnClick, autoUpdatePreviewInput, insertWriteInput };