import ToggleTab from './toggleTab';
import Exec from './execMarkdown';
import {
  extendDefaults,
  containerStyles,
  expandHeight,
  setEditorTextToStore,
  stopStorageInterval,
  autoSaveOnClicked,
  defaultOptionSnippet,
  appendToDOM,
  createDOMElement,
} from './utils';
import { displayButtons, toggleToolbar, toggleToolbarOnResize } from './toolbar';

const snipDown = () => {
  let options = {};
  let editorId;
  let initialSetVal = '';

  const syncValue = () => {
    const defaultTextArea = document.getElementById(editorId);
    const exec = Exec(editorId, {});
    defaultTextArea.value = exec.getMarkdown();
    return defaultTextArea.value;
  };

  const outputData = (editorId, args) => {
    try {
      const { form } = document.getElementById(editorId);
      if (form !== null) {
        form.addEventListener('submit', (e) => {
          syncValue();
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

  const getValue = () => {
    const exec = Exec(editorId, options);
    return exec.getMarkdown();
  };

  const getOptions = () => extendDefaults(options);

  const getDefaultOptions = () => extendDefaults({});

  const getOption = (key) => {
    const obj = extendDefaults(options);
    // eslint-disable-next-line no-prototype-builtins
    if (obj.hasOwnProperty(key)) {
      return obj[key];
    }
    return 'Not an option';
  };

  const setValue = (data) => {
    const allText = {};
    allText[editorId] = data;
    localStorage.setItem('snipText', JSON.stringify(allText));
    const snipWrite = document.getElementById(`snip-write-${editorId}`);
    snipWrite.value = data;
    initialSetVal = data;
  };

  const markDown = (...args) => {
    let defaultTextarea;
    if (args[0] && typeof args[0] === 'object') {
      options = extendDefaults(args[0]);
      defaultTextarea = document.querySelector(`textarea.snip-markdown#${options.container}`);
    } else {
      options = extendDefaults({});

      // eslint-disable-next-line prefer-destructuring
      defaultTextarea = document.querySelectorAll('textarea.snip-markdown')[0];
    }

    if (defaultTextarea !== null) {
      editorId = options.container;
      defaultTextarea.classList.add(editorId);

      const areaParentEle = defaultTextarea.parentElement;
      defaultTextarea.style.display = 'none';

      const snipMarkDown = createDOMElement('div', `snip-text-mark-down snip-text-mark-down-${editorId}`, `snip-text-mark-down-${editorId}`);

      const snipTextContainer = createDOMElement('div', `snip-text-container snip-text-container-${editorId}`);

      const snipTextBody = createDOMElement('div', `snip-text-body snip-text-body-${editorId}`, `snip-text-body-${editorId}`);

      const snipTextAreaContainer = createDOMElement('div', `snip-writearea snip-writearea-${editorId} snip-tab-content snip-tab-content-${editorId} tab-content active`, `snip-writearea-${editorId}`);

      const snipTextAreaParams = [`snip-write-${editorId}`, extendDefaults(options).placeholder, options.minHeight, options.maxHeight];
      const snipTextArea = createDOMElement('textarea', `snip-write snip-write-${editorId}`, ...snipTextAreaParams);

      const snipPreviewArea = createDOMElement('div', `snip-preview snip-preview-${editorId} snip-tab-content-${editorId} snip-tab-content tab-content`, `snip-preview-${editorId}`);

      const displayEmoji = createDOMElement('div', `filter-emoji-area filter-emoji-area-${editorId}`);

      const displayToolbar = createDOMElement('div', `toolbar-button-area toolbar-button-area-${editorId}`);

      const snipUploadImage = createDOMElement('div', `snip-footer snip-footer-${editorId}`);

      const mirrorDiv = createDOMElement('div', `${editorId}--mirror-div snip-mirror-div`, `${editorId}--mirror-div`);

      const buttonContainer = createDOMElement('div', `snip-text-header snip-text-header-${editorId}`);

      const aa = () => {
        const textarea = document.getElementById(`snip-write-${editorId}`);
        document.querySelector(`.snip-text-button-container-${editorId}`).classList.remove('remove');

        toggleToolbarOnResize(editorId);
        const textAreaHeight = textarea.style.height;

        defaultOptionSnippet(options, editorId, snipUploadImage);

        textarea.style.height = `${expandHeight(textarea, textAreaHeight)}px`;

        toggleToolbar(editorId);

        const exec = Exec(editorId, options);
        exec.outputMarkDown();
        containerStyles(options, editorId);
        ToggleTab.toggle(`snip-text-tabnav-tabs-${editorId}`, editorId);
        ToggleTab.togglePreview(editorId, options);

        outputData(editorId, options);
        setEditorTextToStore(editorId, options, initialSetVal);
        exec.uploadImage();
        autoSaveOnClicked(editorId, options);
      };

      window.addEventListener('load', () => {
        aa();
      });

      window.addEventListener('resize', () => {
        toggleToolbarOnResize(editorId);
      });

      appendToDOM(snipTextContainer, snipMarkDown);
      appendToDOM(areaParentEle, snipTextContainer);
      snipTextContainer.prepend(defaultTextarea);

      const appended = [snipTextArea, displayEmoji, displayToolbar, snipUploadImage];
      appendToDOM(snipTextAreaContainer, ...appended);

      appendToDOM(snipMarkDown, ...[buttonContainer, snipTextBody]);

      displayButtons(options);

      const appended2 = [snipTextAreaContainer, snipPreviewArea, mirrorDiv];
      appendToDOM(snipTextBody, ...appended2);
    }
  };

  return {
    markDown,
    getValue,
    syncValue,
    setValue,
    getOptions,
    getOption,
    getDefaultOptions,
  };
};

export default snipDown;