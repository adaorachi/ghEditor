import extendDefaults from '../settings/customOptionSetting';
import { stopStorageInterval } from '../features/utils/saveInterval';
import getMarkdown from '../features/getMarkdown';

const syncValueFunc = (editorId) => {
  const defaultTextArea = document.getElementById(editorId);
  defaultTextArea.value = getMarkdown(editorId, {});
  return defaultTextArea.value;
};

const setValueFunc = (data, editorId) => {
  const allText = {};
  allText[editorId] = data;
  localStorage.setItem('snipText', JSON.stringify(allText));
  const snipWrite = document.getElementById(`snip-write-${editorId}`);
  snipWrite.value = data;
};

const getOptionFunc = (key, options) => {
  const obj = extendDefaults(options);
  // eslint-disable-next-line no-prototype-builtins
  if (obj.hasOwnProperty(key)) {
    return obj[key];
  }
  return 'Not an option';
};

const outputDataFunc = (editorId, args) => {
  try {
    const { form } = document.getElementById(editorId);
    if (form !== null) {
      form.addEventListener('submit', (e) => {
        syncValueFunc();
        const snipWrite = document.getElementById(`snip-write-${editorId}`);
        snipWrite.value = '';
        snipWrite.style.height = extendDefaults(args).minHeight;
        window.localStorage.removeItem('snipText');
        stopStorageInterval(editorId);
        e.preventDefault();
      });
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
};

export {
  syncValueFunc,
  setValueFunc,
  getOptionFunc,
  outputDataFunc,
};