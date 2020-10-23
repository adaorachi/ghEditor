import { setEditorTextToStore, setDataToStorage } from './utils/setStorage';
import { savedTimer } from '../dom/insertDomSnippet';

const autoSaveAttr = (editorId) => {
  const footer = document.querySelector(`.gheditor-footer-${editorId}`);
  const autoSaveArea = document.createElement('div');
  autoSaveArea.id = `gheditor-autosave-${editorId}`;
  autoSaveArea.className = 'gheditor-autosave';
  footer.append(autoSaveArea);
};

const autoSaveOnClicked = (editorId) => {
  const timer2 = document.getElementById(`auto-saved-${editorId}`);
  const autoSavedButton = document.getElementById(`auto-save-icon-${editorId}`);
  autoSavedButton.addEventListener('click', () => {
    setDataToStorage(editorId);
    document.getElementById(`timer-pre-${editorId}`).innerText = 'Saved:';
    timer2.classList.add('scale');
    setTimeout(() => {
      document.getElementById(`timer-pre-${editorId}`).innerText = 'Autosaved:';
      timer2.classList.remove('scale');
    }, 200);
  });
};

const setAutoSave = (editorId, props, value) => {
  const textarea = document.getElementById(`gheditor-write-${editorId}`);

  if (props.autoSave.enabled) {
    autoSaveAttr(editorId);
    document.getElementById(`gheditor-autosave-${editorId}`).innerHTML = `${savedTimer(editorId)}`;
    autoSaveOnClicked(editorId);
    setEditorTextToStore(editorId, textarea);
  } else {
    textarea.value = value;
    window.localStorage.removeItem('gheditorText');
  }
};

export default setAutoSave;