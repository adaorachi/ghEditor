import { getCurrentTime } from '../../helpers/helpers';

const setEditorTextToStore = (editorId, textarea) => {
  let allText;

  if (localStorage.getItem('gheditorText') === null) {
    allText = {};
    allText[editorId] = textarea.value;
    localStorage.setItem('gheditorText', JSON.stringify(allText));
  } else {
    const allText1 = JSON.parse(localStorage.getItem('gheditorText'));
    // eslint-disable-next-line no-prototype-builtins
    if (!(allText1.hasOwnProperty(editorId))) {
      allText1[editorId] = textarea.value;
      localStorage.setItem('gheditorText', JSON.stringify(allText1));
    }
    allText = allText1[editorId] === undefined ? '' : allText1[editorId];
    textarea.value = allText;
  }
};

const setDataToStorage = (editorId) => {
  const textEditorValue = document.getElementById(`gheditor-write-${editorId}`).value;
  let allText;
  if (textEditorValue !== '') {
    if (localStorage.getItem('gheditorText') === null) {
      allText = {};
    } else {
      allText = JSON.parse(localStorage.getItem('gheditorText'));
      document.getElementById(`saved-timer-${editorId}`).innerText = `${getCurrentTime()}`;
    }
    allText[editorId] = textEditorValue;
    localStorage.setItem('gheditorText', JSON.stringify(allText));
  }
};

export { setEditorTextToStore, setDataToStorage };