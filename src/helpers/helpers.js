/* eslint-disable prefer-destructuring */
const createDOMElement = (tag, className, ...args) => {
  const a = document.createElement(tag);
  a.className = className;
  if (args.length > 0) {
    a.id = args[0];
    a.placeholder = args[1];
    a.style.height = args[2];
    a.style.maxHeight = args[3];
  }
  return a;
};

const appendToDOM = (appender, ...args) => {
  args.forEach(arg => {
    appender.append(arg);
  });
};

const getCurrentTime = () => {
  const autoSaved = new Date();
  const autoSavedToLocal = autoSaved.toLocaleTimeString();
  return autoSavedToLocal;
};

const hideAndDisplayNav = (ele, arrayList, active) => {
  const array = document.querySelectorAll(arrayList);
  Array.from(array).forEach((item) => {
    if (item.id === ele) {
      item.classList.add(active);
    } else {
      item.classList.remove(active);
    }
  });
};

const displayWordCount = (editorId) => {
  const text = document.getElementById(`snip-preview-${editorId}`).innerText.trim();
  const charactersLength = text.length;
  const wordSplit = text.replace(/\r?\n/g, ' ').split(' ');
  const wordLength = text === '' ? 0 : wordSplit.length;

  const snipWord = document.querySelector(`.snip-word-count-${editorId}`);
  snipWord.innerHTML = `${charactersLength} characters ${wordLength} words`;
};

const removeDropdowns = (args, className) => {
  [...args].forEach((arg) => {
    document.querySelector(arg).classList.remove(className);
  });
};

const mutateContent = (content1, content2) => {
  document.querySelector(content1).classList.remove('remove');
  document.querySelector(content2).classList.add('remove');
};

const nothingToPreviewDisplay = (editorId) => {
  const snipTextArea = document.getElementById(`snip-write-${editorId}`);
  const snipPreviewArea = document.getElementById(`snip-preview-${editorId}`);
  snipPreviewArea.style.height = 'auto';
  if (snipTextArea.value === '') {
    snipPreviewArea.innerHTML = '<p class="placeholder">Nothing to preview<p>';
  }
};

export {
  createDOMElement,
  appendToDOM,
  getCurrentTime,
  hideAndDisplayNav,
  displayWordCount,
  removeDropdowns,
  mutateContent,
  nothingToPreviewDisplay,
};