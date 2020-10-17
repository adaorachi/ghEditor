import { togglePreviewOnClick, toggleMoreToolbar } from '../features/textArea/toggleTab';
import splitScreen from '../features/splitScreen';
import { containerStyles, expandHeight } from '../features/utils/computedProps';
import { toggleToolbarOnResize } from '../dom/appendHeaderToDOM';
import setAutoSave from '../features/autoSave';
import outputMarkDown from '../features/outputMarkdown';

const callFuncOnInit = (editorId, options, initialSetVal) => {
  const textarea = document.getElementById(`snip-write-${editorId}`);
  document.querySelector(`.snip-text-button-container-${editorId}`).classList.remove('remove');

  const textAreaHeight = textarea.style.height;

  textarea.style.height = `${expandHeight(textarea, textAreaHeight)}px`;

  toggleMoreToolbar(editorId);

  outputMarkDown(editorId, options);

  containerStyles(options, editorId);
  togglePreviewOnClick(`snip-text-tabnav-tabs-${editorId}`, editorId);
  splitScreen(editorId, options);

  setAutoSave(editorId, options, initialSetVal);

  toggleToolbarOnResize(editorId);
};

export default callFuncOnInit;