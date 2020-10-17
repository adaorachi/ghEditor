import { getCurrentTime } from '../../helpers/helpers';

const setEditorTextToStore = (editorId, textarea) => {
  let allText;

  if (localStorage.getItem('snipText') === null) {
    allText = {};
    allText[editorId] = textarea.value;
    localStorage.setItem('snipText', JSON.stringify(allText));
  } else {
    const allText1 = JSON.parse(localStorage.getItem('snipText'));
    // eslint-disable-next-line no-prototype-builtins
    if (!(allText1.hasOwnProperty(editorId))) {
      allText1[editorId] = '';
      localStorage.setItem('snipText', JSON.stringify(allText1));
    }
    allText = allText1[editorId] === undefined ? '' : allText1[editorId];
    textarea.value = allText;
  }
};

const setDataToStorage = (editorId) => {
  const textEditorValue = document.getElementById(`snip-write-${editorId}`).value;
  let allText;
  if (textEditorValue !== '') {
    if (localStorage.getItem('snipText') === null) {
      allText = {};
    } else {
      allText = JSON.parse(localStorage.getItem('snipText'));
      document.getElementById(`saved-timer-${editorId}`).innerText = `${getCurrentTime()}`;
    }
    allText[editorId] = textEditorValue;
    localStorage.setItem('snipText', JSON.stringify(allText));
  }
};

export { setEditorTextToStore, setDataToStorage };