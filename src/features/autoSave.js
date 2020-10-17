import extendDefaults from '../settings/customOptionSetting';
import { setEditorTextToStore, setDataToStorage } from './utils/setStorage';
import { savedTimer } from '../dom/insertDomSnippet';

const autoSaveAttr = (editorId) => {
  const footer = document.querySelector(`.snip-footer-${editorId}`);
  const autoSaveArea = document.createElement('div');
  autoSaveArea.id = `snip-autosave-${editorId}`;
  autoSaveArea.className = 'snip-autosave';
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
  const textarea = document.getElementById(`snip-write-${editorId}`);

  if (extendDefaults(props).autoSave.enabled) {
    autoSaveAttr(editorId);
    document.getElementById(`snip-autosave-${editorId}`).innerHTML = `${savedTimer(editorId)}`;
    autoSaveOnClicked(editorId);
    setEditorTextToStore(editorId, textarea);
  } else {
    textarea.value = value;
    window.localStorage.removeItem('snipText');
  }
};

export default setAutoSave;