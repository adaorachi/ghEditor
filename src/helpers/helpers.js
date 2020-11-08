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
  const text = document.getElementById(`gheditor-preview-${editorId}`).innerText.trim();
  const charactersLength = text.length;
  const wordSplit = text.replace(/\r?\n/g, ' ').split(' ');
  const wordLength = text === '' ? 0 : wordSplit.length;

  const gheditorWord = document.querySelector(`.gheditor-word-count-${editorId}`);
  gheditorWord.innerHTML = `${charactersLength} characters ${wordLength} words`;
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
  const gheditorTextArea = document.getElementById(`gheditor-write-${editorId}`);
  const gheditorPreviewArea = document.getElementById(`gheditor-preview-${editorId}`);
  if (gheditorTextArea.value === '') {
    gheditorPreviewArea.innerHTML = '<p class="placeholder">Nothing to preview<p>';
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