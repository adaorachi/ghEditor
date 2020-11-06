import { getCurrentTime } from '../../helpers/helpers';

let allText = JSON.parse(localStorage.getItem('gheditorText'));

const removeDataFromStore = (editorId) => {
  if (allText !== null) {
    // eslint-disable-next-line no-prototype-builtins
    if (allText.hasOwnProperty(editorId)) {
      delete allText[editorId];
      localStorage.setItem('gheditorText', JSON.stringify(allText));
    }
  }
};

const setDataToStorage = (editorId) => {
  const textEditorValue = document.getElementById(`gheditor-write-${editorId}`).value;
  if (localStorage.getItem('gheditorText') === null) {
    allText = {};
  } else {
    document.getElementById(`saved-timer-${editorId}`).innerText = `${getCurrentTime()}`;
  }

  allText[editorId] = textEditorValue;
  localStorage.setItem('gheditorText', JSON.stringify(allText));
};

const getDataFromStore = (editorId, textarea) => {
  if (allText !== null) {
    // eslint-disable-next-line no-prototype-builtins
    if (allText.hasOwnProperty(editorId)) {
      const allTextRef = allText[editorId] === undefined ? '' : allText[editorId];
      textarea.value = allTextRef;
      setDataToStorage(editorId);
    }
  }
};

export { getDataFromStore, setDataToStorage, removeDataFromStore };